import {getLicenseLabel, getSafeUrl, joinArrayField} from "./helpers"

/**
 * Check if an embed-snippet can be generated for the given dataset.
 * @param {Object} data data to check
 */
export function isEmbeddable(data) {
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
        "apache",
        "bsd",
        "gpl",
        "mit",
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
  return (
    data.licenseGroup.startsWith("by") ||
    ["apache", "bsd", "gpl", "mit"].includes(data.licenseGroup)
  )
}

/**
 * Get the html embedding code for the given data.
 * @param {Object} data data
 * @param {Object} t translation function
 */
export function getHtmlEmbedding(data, t) {
  const htmlMedia = getHtmlEmbeddingMedia(data, t)
  const htmlCaption = getHtmlEmbeddingCaption(data, t)
  let html
  if (htmlMedia) {
    html = `<!-- OERSI: embed ${data.id} -->
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
    html = `<!-- OERSI: embed ${data.id} -->
<div class="embedded-material">
    ${htmlCaption}
</div>
`
  }
  return html
}

export function getDefaultHtmlEmbeddingStyles() {
  return {
    ".embedded-material": {
      margin: "0 0 1em",
      "& a": {
        textDecoration: "None",
        "&:hover, &:focus": {textDecoration: "underline"},
      },
    },
  }
}

/**
 * Get the html embedding code for the media part.
 * @param {Object} data data
 * @param {Object} t translation function
 */
function getHtmlEmbeddingMedia(data, t) {
  let encoding = data.encoding ? data.encoding.find((e) => e.embedUrl != null) : null
  if (encoding) {
    return `<iframe width="100%" height="100%" src="${encoding.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  }
  if (data.image) {
    return `<a href="${getSafeUrl(
      data.id
    )}"><img width="100%" height="100%" style="object-fit: cover;" src="${
      data.image
    }"></a>`
  }
  return ""
}
function getHtmlEmbeddingCaption(data, t) {
  let caption = `<q><a href="${getSafeUrl(data.id)}">${data.name}</a></q>`
  if (citationNeedsAuthor(data)) {
    if (t("EMBED_MATERIAL.BY")) {
      caption += " " + t("EMBED_MATERIAL.BY")
    }
    caption += " " + joinArrayField(data.creator, (item) => item.name, null)
  }
  caption += ` ${t("EMBED_MATERIAL.UNDER")} <a href="${getSafeUrl(
    data.license.id
  )}">${getLicenseLabel(data.license.id)}</a>`
  return caption
}
