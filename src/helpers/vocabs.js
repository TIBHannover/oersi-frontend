/**
 * builds a map id->parentId
 * @param vocabScheme
 * @returns {*}
 */
function buildParentIdMap(vocabScheme) {
  const getParentIdCollector = (parentId) => {
    return (map, val) => {
      map[val["id"]] = parentId
      if ("narrower" in val) {
        map = val["narrower"].reduce(getParentIdCollector(val["id"]), map)
      }
      return map
    }
  }
  return vocabScheme["hasTopConcept"].reduce(getParentIdCollector(null), {})
}

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
    if (
      d.parentId !== null &&
      !ids.includes(d.parentId) &&
      !list.map((i) => i.key).includes(d.parentId)
    ) {
      list = [
        {key: d.parentId, parentId: parentIdMap[d.parentId], doc_count: 0},
      ].reduce(addNonPresentParentId, list)
    }
    return list
  }
  return data.reduce(addNonPresentParentId, [])
}

/**
 *
 * @param dataList the flat vocab-list that should be converted
 * @param vocabScheme the scheme of the vocab describing the hierarchical structure of the vocab
 */
export function toHierarchicalList(dataList, vocabScheme) {
  if (!dataList || !vocabScheme) {
    return []
  }
  const parentIdMap = buildParentIdMap(vocabScheme)
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
