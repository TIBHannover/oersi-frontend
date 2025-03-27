import {getLicenseLabel} from "./helpers"

/**
 * Check if an embed-snippet can be generated for the given dataset.
 * @param {Object} baseFieldValues data to check
 */
export function isEmbeddable(baseFieldValues) {
  if (baseFieldValues.licenseGroup) {
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
        "apache",
        "bsd",
        "gpl",
        "mit",
      ].includes(baseFieldValues.licenseGroup)
    ) {
      return !citationNeedsAuthor(baseFieldValues) || hasAuthor(baseFieldValues)
    }
  }
  return false
}

/**
 * Check if the given dataset has at least one author.
 * @param {Object} baseFieldValues data to check
 */
function hasAuthor(baseFieldValues) {
  if (!baseFieldValues.author) {
    return false
  }
  return baseFieldValues.author.length > 0
}

/**
 * Check if the author is required in the citation of the given dataset.
 * @param {Object} data data to check
 */
function citationNeedsAuthor(data) {
  return (
    data.licenseGroup.startsWith("by") ||
    ["apache", "bsd", "gpl", "mit"].includes(data.licenseGroup)
  )
}

/**
 * Get the html embedding code for the given data.
 * @param {Object} embeddingFieldValues data
 * @param {Object} t translation function
 */
export function getHtmlEmbedding(embeddingFieldValues, t) {
  const htmlMedia = getHtmlEmbeddingMedia(embeddingFieldValues)
  const htmlCaption = getHtmlEmbeddingCaption(embeddingFieldValues, t)
  let html
  if (htmlMedia) {
    html = `<!-- embed ${embeddingFieldValues.resourceLink} -->
<figure class="embedded-material">
    <div class="embedded-media-container" style="max-width: 560px; max-height: 315px;">
        <!-- next two div for responsive styling, Aspect Ratio 16:9 -->
        <div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" >
                ${htmlMedia}
            </div>
        </div>
    </div>
    <figcaption>
        ${htmlCaption}
    </figcaption>
</figure>
`
  } else {
    html = `<!-- embed ${embeddingFieldValues.resourceLink} -->
<div class="embedded-material">
    ${htmlCaption}
</div>
`
  }
  return html
}

/**
 * Get the html embedding code for the media part.
 * @param {Object} embeddingFieldValues data
 */
function getHtmlEmbeddingMedia(embeddingFieldValues) {
  let mediaUrl = embeddingFieldValues.mediaUrl
  if (!mediaUrl) {
    mediaUrl = embeddingFieldValues.fallbackMediaUrl?.find((e) => e)
  }
  if (mediaUrl) {
    return `<iframe width="100%" height="100%" src="${mediaUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  } else if (embeddingFieldValues.thumbnailUrl) {
    // last fallback is the thumbnail url
    return `<a href="${embeddingFieldValues.resourceLink}"><img width="100%" height="100%" style="object-fit: cover;" src="${embeddingFieldValues.thumbnailUrl}" alt="resource image"></a>`
  }
  return ""
}
function getHtmlEmbeddingCaption(embeddingFieldValues, t) {
  let caption = `<q><a href="${embeddingFieldValues.resourceLink}">${embeddingFieldValues.title}</a></q>`
  if (citationNeedsAuthor(embeddingFieldValues)) {
    if (t("EMBED_MATERIAL.BY")) {
      caption += " " + t("EMBED_MATERIAL.BY")
    }
    caption += " " + embeddingFieldValues.author.join(", ")
  }
  caption += ` ${t("EMBED_MATERIAL.UNDER")} <a href="${
    embeddingFieldValues.licenseUrl
  }">${getLicenseLabel(embeddingFieldValues.licenseUrl)}</a>`
  return caption
}
