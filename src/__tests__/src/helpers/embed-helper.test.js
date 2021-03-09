import React from "react"
import {
  getHtmlEmbedding,
  getLicenseLabel,
  isEmbeddable,
} from "../../../helpers/embed-helper"

function translateDummy(key, options) {
  return key + "_translated"
}
const defaultMediaMapping = [
  {
    regex: "https://av.tib.eu/media/([0-9]+)",
    html: (match) =>
      `<iframe width="100%" height="100%" scrolling="no" src="//av.tib.eu/player/${match[1]}" frameborder="0" allowfullscreen></iframe>`,
  },
]

describe("embed-helper", () => {
  it("isEmbeddable: data without license", () => {
    let data = {
      id: 1,
      name: "Test",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: unknown license", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "xxx",
      license: "https://xyz.org/sdgsdgd/xxx/4.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: by-license and missing author", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: by-license and empty author", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by-sa",
      license: "https://creativecommons.org/licenses/by-sa/4.0",
      creator: [],
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: cc-zero", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "zero",
      license: "https://creativecommons.org/publicdomain/zero/1.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(true)
  })

  it("isEmbeddable: by-license", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
      creator: [
        {
          id: null,
          name: "Max Mustermann",
          type: "Person",
        },
      ],
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(true)
  })

  it("getHtmlEmbedding: by-license", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
      creator: [
        {
          id: null,
          name: "Max Mustermann",
          type: "Person",
        },
      ],
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).toContain(" EMBED_MATERIAL.BY_translated Max Mustermann ")
  })
  it("getHtmlEmbedding: cc-zero license", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "zero",
      license: "https://creativecommons.org/publicdomain/zero/1.0",
      creator: [
        {
          id: null,
          name: "Max Mustermann",
          type: "Person",
        },
      ],
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).not.toContain("EMBED_MATERIAL.BY_translated Max Mustermann")
  })

  it("getLicenseLabel: PDM", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/publicdomain/mark/1.0/"
    )
    expect(result).toEqual("Public Domain Mark 1.0")
  })
  it("getLicenseLabel: CC0", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/publicdomain/zero/1.0/"
    )
    expect(result).toEqual("CC0 1.0")
  })
  it("getLicenseLabel: CC BY-SA 3.0 DE", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/licenses/by-sa/3.0/de/"
    )
    expect(result).toEqual("CC BY-SA 3.0 DE")
  })
  it("getLicenseLabel: CC BY 4.0", () => {
    let result = getLicenseLabel("https://creativecommons.org/licenses/by/4.0/")
    expect(result).toEqual("CC BY 4.0")
  })
  it("getLicenseLabel: no match", () => {
    let result = getLicenseLabel("https://some/license/xxx/3.1/")
    expect(result).toEqual("")
  })

  it("getHtmlEmbedding: include av-portal media", () => {
    let data = {
      id: "https://av.tib.eu/media/1234",
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
      creator: [
        {
          id: null,
          name: "Max Mustermann",
          type: "Person",
        },
      ],
    }
    let result = getHtmlEmbedding(data, translateDummy, defaultMediaMapping)
    expect(result).toContain('<figure class="embedded-material">')
  })

  it("getHtmlEmbedding: use preview image for unknown sources", () => {
    let data = {
      id: "https://xxxx.yyy/media/1234",
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
      image: "https://some.path/image",
      creator: [
        {
          id: null,
          name: "Max Mustermann",
          type: "Person",
        },
      ],
    }
    let result = getHtmlEmbedding(data, translateDummy, defaultMediaMapping)
    expect(result).toContain('<figure class="embedded-material">')
  })
})
