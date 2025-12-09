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
  const addChildren = (p) => {
    return {
      ...p,
      children: extendedList.filter((d) => d.parentId === p.key).map(addChildren),
    }
  }
  const convertToVocabNodes = (d) => {
    const node = new HierarchicalVocabNode(d.key, d.doc_count, d)
    if (d.children.length) {
      node.children = d.children.map(convertToVocabNodes).map((e) => {
        e.parent = node
        return e
      })
    }
    return node
  }
  return extendedList
    .filter((d) => d.parentId === null)
    .map(addChildren)
    .map(convertToVocabNodes)
}

export function getSiblings(node) {
  if (node.parent === null) {
    return []
  }
  return node.parent.children.filter((d) => d.key !== node.key)
}

class HierarchicalVocabNode {
  constructor(key, doc_count, originalData = null) {
    this.key = key
    this.doc_count = doc_count
    this.parent = null
    this.children = []
    this.originalData = originalData
  }
}
export class HierarchicalDataPreparer {
  constructor(data, parentIdMap) {
    this.data = toHierarchicalList(data, parentIdMap)
  }
  modifyNodes(modFcn) {
    modifyAll(this.data, modFcn)
    return this
  }
}

export function findAllChildNodes(node, filterFcn) {
  const getNodes = (list, e) => {
    if (filterFcn(e)) {
      list.push(e)
    }
    if (e.children.length > 0) {
      list = e.children.reduce(getNodes, list)
    }
    return list
  }
  return node.children?.length ? node.children.reduce(getNodes, []) : []
}
export function modifyAll(nodes, modFcn) {
  return nodes.map((node) => {
    modFcn(node)
    if (node.children?.length) {
      modifyAll(node.children, modFcn)
    }
    return node
  })
}
export function modifyAllParents(node, modFcn) {
  if (node.parent) {
    modFcn(node.parent)
    modifyAllParents(node.parent, modFcn)
  }
}
