import {joinArrayField} from "./helpers"

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

/**
 * Get the html embedding code for the given data.
 * @param {Object} data data
 * @param {Object} t translation function
 */
export function getHtmlEmbedding(data, t) {
  return `<!-- OERSI: embed ${data.id} -->
<div class="embedded-material">
    ${getHtmlEmbeddingCaption(data, t)}
</div>
`
}

function getHtmlEmbeddingCaption(data, t) {
  let caption = `<q><a href="${data.id}">${data.name}</a></q>`
  if (citationNeedsAuthor(data)) {
    caption +=
      " " +
      t("EMBED_MATERIAL.BY") +
      " " +
      joinArrayField(data.creator, (item) => item.name, null)
  }
  caption += ` ${t("EMBED_MATERIAL.UNDER")} <a href="${
    data.license
  }">${data.licenseGroup.toUpperCase()}</a>`
  return caption
}
