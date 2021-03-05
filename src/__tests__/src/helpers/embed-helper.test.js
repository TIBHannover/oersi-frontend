import React from "react"
import {getHtmlEmbedding, isEmbedable} from "../../../helpers/embed-helper"

function translateDummy(key, options) {
  return key + "_translated"
}

describe("embed-helper", () => {
  it("isEmbedable: data without license", () => {
    let data = {
      id: 1,
      name: "Test",
    }
    let result = isEmbedable(data)
    expect(result).toEqual(false)
  })

  it("isEmbedable: unknown license", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "xxx",
      license: "https://xyz.org/sdgsdgd/xxx/4.0",
    }
    let result = isEmbedable(data)
    expect(result).toEqual(false)
  })

  it("isEmbedable: by-license and missing author", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by",
      license: "https://creativecommons.org/licenses/by/4.0",
    }
    let result = isEmbedable(data)
    expect(result).toEqual(false)
  })

  it("isEmbedable: by-license and empty author", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "by-sa",
      license: "https://creativecommons.org/licenses/by-sa/4.0",
      creator: [],
    }
    let result = isEmbedable(data)
    expect(result).toEqual(false)
  })

  it("isEmbedable: cc-zero", () => {
    let data = {
      id: 1,
      name: "Test",
      licenseGroup: "zero",
      license: "https://creativecommons.org/publicdomain/zero/1.0",
    }
    let result = isEmbedable(data)
    expect(result).toEqual(true)
  })

  it("isEmbedable: by-license", () => {
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
    let result = isEmbedable(data)
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
})
