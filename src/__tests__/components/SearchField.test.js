import React from "react"
import SearchField from "../../components/SearchField"
import {render} from "@testing-library/react"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"

jest.mock("@appbaseio/reactivesearch", () => ({
  DataSearch: () => <div />,
}))
jest.mock("react-router", () => ({
  useLocation: () => {},
  useNavigate: () => {},
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
  it("SearchField : should render correctly", () => {
    render(
      <SearchIndexFrontendConfigContext.Provider
        value={{searchConfiguration: getDefaultSearchConfiguration()}}
      >
        <SearchField />
      </SearchIndexFrontendConfigContext.Provider>
    )
  })
})
