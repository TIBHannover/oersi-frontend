import React from "react"
import AppComponent from "../../../App"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import {render} from "../../../setupFiles"

const credencialTest = {
  ELASTIC_SEARCH: {
    URL: "https://scalr.api.appbase.io",
    CREDENCIAL: "cxcxcxcxcx",
    APP_NAME: "oer_test",
  },
}

beforeEach(() => {
  // setup a config file
  config.set(prod)
})

describe("AppComponent ==> Test  ", () => {
  it("AppComponent : should render with credentials error ", async () => {
    try {
      render(<AppComponent data={credencialTest.ELASTIC_SEARCH} config={config} />)
    } catch (error) {
      expect(error.message).toBe(
        "Authentication information is not present. Did you add credentials?"
      )
    }
  })
})
