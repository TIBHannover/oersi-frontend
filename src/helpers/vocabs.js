/**
 * Add entries for parentIds that are not included in the given data, but that are contained in a used path of the data
 * @param data
 * @param parentIdMap
 * @returns {*}
 */
function addMissingParentIds(data, parentIdMap) {
  const ids = data.map((d) => d.key)
  const addNonPresentParentId = (list, d) => {
    list.push(d)
    const parentIdExists = d.parentId !== null && d.parentId !== undefined
    if (
      parentIdExists &&
      !ids.includes(d.parentId) &&
      !list.map((i) => i.key).includes(d.parentId)
    ) {
      list = [
        {
          key: d.parentId,
          parentId: d.parentId in parentIdMap ? parentIdMap[d.parentId] : null,
          doc_count: 0,
        },
      ].reduce(addNonPresentParentId, list)
    }
    return list
  }
  return data.reduce(addNonPresentParentId, [])
}

/**
 *
 * @param dataList the flat vocab-list that should be converted
 * @param parentIdMap the scheme of the vocab describing the hierarchical structure of the vocab - just the map of id->parentId
 */
export function toHierarchicalList(dataList, parentIdMap) {
  if (!dataList || !parentIdMap) {
    return []
  }
  let extendedList = dataList.map((d) => ({
    ...d,
    parentId: d.key in parentIdMap ? parentIdMap[d.key] : null,
  }))
  extendedList = addMissingParentIds(extendedList, parentIdMap)
  const hierarchicalList = extendedList.filter((d) => d.parentId === null)
  const addChildren = (p) => {
    return {
      ...p,
      children: extendedList.filter((d) => d.parentId === p.key).map(addChildren),
    }
  }
  return hierarchicalList.map(addChildren)
}
