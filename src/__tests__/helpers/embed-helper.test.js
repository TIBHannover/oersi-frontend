import {getHtmlEmbedding, isEmbeddable} from "../../helpers/embed-helper"

function translateDummy(key, options) {
  return key + "_translated"
}

describe("embed-helper", () => {
  it("isEmbeddable: data without license", () => {
    let data = {
      id: 1,
      title: "Test",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: unknown license", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "xxx",
      licenseUrl: "https://xyz.org/sdgsdgd/xxx/4.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: by-license and missing author", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: by-license and empty author", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "by-sa",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      author: [],
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(false)
  })

  it("isEmbeddable: cc-zero", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "zero",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0",
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(true)
  })

  it("isEmbeddable: by-license", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      author: ["Max Mustermann"],
    }
    let result = isEmbeddable(data)
    expect(result).toEqual(true)
  })

  it("getHtmlEmbedding: by-license", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      author: ["Max Mustermann"],
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).toContain(" EMBED_MATERIAL.BY_translated Max Mustermann ")
  })
  it("getHtmlEmbedding: cc-zero license", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "zero",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0",
      author: ["Max Mustermann"],
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).not.toContain("EMBED_MATERIAL.BY_translated Max Mustermann")
  })
  it("getHtmlEmbedding: empty BY-translation should not result in two WS", () => {
    let data = {
      id: 1,
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      author: ["Max Mustermann"],
    }
    let result = getHtmlEmbedding(data, (key, options) =>
      key === "EMBED_MATERIAL.BY" ? "" : translateDummy(key, options)
    )
    expect(result).not.toContain("  Max Mustermann")
  })

  it("getHtmlEmbedding: include av-portal media", () => {
    let data = {
      id: "https://av.tib.eu/media/1234",
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      author: ["Max Mustermann"],
      mediaUrl: "//av.tib.eu/player/1234",
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).toContain('<figure class="embedded-material">')
  })

  it("getHtmlEmbedding: use preview image for unknown sources", () => {
    let data = {
      id: "https://xxxx.yyy/media/1234",
      title: "Test",
      licenseGroup: "by",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      thumbnailUrl: "https://some.path/image",
      author: ["Max Mustermann"],
    }
    let result = getHtmlEmbedding(data, translateDummy)
    expect(result).toContain('<figure class="embedded-material">')
  })
})
