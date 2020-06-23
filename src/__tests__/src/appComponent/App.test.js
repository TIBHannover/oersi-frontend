import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import App from "../../../App"
import config from "react-global-configuration"
const credencialTest = {
  ELASTIC_SEARCH: {
    URL: "localhost:9200/",
    CREDENCIAL: "cxcxcxcxcx",
    APP_NAME: "oer_test",
  },
}

describe("AppComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(
    <App data={credencialTest.ELASTIC_SEARCH} config={config} />
  )
  it("AppComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
