import React from "react"
import {registerConfiguration} from "../../config/configurationData"
import SearchField from "../../components/SearchField"
import {render} from "@testing-library/react"

jest.mock("@appbaseio/reactivesearch", () => ({
  DataSearch: () => <div />,
}))
jest.mock("react-router-dom", () => ({
  useLocation: () => {},
  useHistory: () => {},
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe("SearchField ==> Test UI  ", () => {
  registerConfiguration()
  it("SearchField : should render correctly", () => {
    render(<SearchField />)
  })
})
