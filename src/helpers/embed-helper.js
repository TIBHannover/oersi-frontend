import {joinArrayField} from "./helpers"

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
  const htmlMedia = getHtmlEmbeddingMedia(data, t, defaultMediaMapping)
  const htmlCaption = getHtmlEmbeddingCaption(data, t)
  if (htmlMedia) {
    return `<!-- OERSI: embed ${data.id} -->
<figure class="embedded-material">
    ${htmlMedia}
    <figcaption>
        ${htmlCaption}
    </figcaption>
</figure>
`
  }
  return `<!-- OERSI: embed ${data.id} -->
<div class="embedded-material">
    ${htmlCaption}
</div>
`
}

const defaultMediaMapping = [
  {
    regex: "https://av.tib.eu/media/([0-9]+)",
    html: (match) =>
      `<iframe width="560" height="315" scrolling="no" src="//av.tib.eu/player/${match[1]}" frameborder="0" allowfullscreen></iframe>`,
  },
]

/**
 * Get the html embedding code for the media part.
 * @param {Object} data data
 * @param {Object} t translation function
 * @param {Object} mediaMapping mapping from source url to embedding-code for media
 */
function getHtmlEmbeddingMedia(data, t, mediaMapping) {
  if (mediaMapping) {
    let m
    for (let i = 0; i < mediaMapping.length; i++) {
      m = mediaMapping[i]
      const regex = new RegExp(m.regex)
      const match = regex.exec(data.id)
      if (match) {
        return m.html(match)
      }
    }
  }
  return ""
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
  }">${getLicenseLabel(data.license)}</a>`
  return caption
}

export function getLicenseLabel(license) {
  const regex = /^https?:\/\/creativecommons.org\/(?:licenses|licences|publicdomain)(?:\/publicdomain)?\/([a-zA-Z-]+)(?:\/([0-9.]+))?(?:\/([a-z]+))?/g
  let match = regex.exec(license)
  if (match) {
    let label
    const group = match[1].toLowerCase()
    const version = match[2]
    const country = match[3]
    if (group === "mark") {
      label = "Public Domain Mark"
    } else if (group === "zero") {
      label = "CC0"
    } else {
      label = "CC " + group.toUpperCase()
    }
    if (version) {
      label += " " + version
    }
    if (country) {
      label += " " + country.toUpperCase()
    }
    return label
  }
  return ""
}
