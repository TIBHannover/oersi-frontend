/**
 * Check if an embed-snippet can be generated for the given dataset.
 * @param {Object} data data to check
 */
export function isEmbedable(data) {
  if (data.licenseGroup) {
    if (
      [
        "by",
        "by-nc",
        "by-nc-nd",
        "by-nc-sa",
        "by-nd",
        "by-sa",
        "pdm",
        "zero",
      ].includes(data.licenseGroup)
    ) {
      return !citationNeedsAuthor(data) || hasAuthor(data)
    }
  }
  return false
}

/**
 * Check if the given dataset has at least one author.
 * @param {Object} data data to check
 */
function hasAuthor(data) {
  if (!data.creator) {
    return false
  }
  return data.creator.length > 0
}

/**
 * Check if the author is required in the citation of the given dataset.
 * @param {Object} data data to check
 */
function citationNeedsAuthor(data) {
  return data.licenseGroup.startsWith("by")
}
