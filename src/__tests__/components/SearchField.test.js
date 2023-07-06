import React from "react"
import SearchField from "../../components/SearchField"
import {render} from "@testing-library/react"
import searchConfiguration from "../../config/SearchConfiguration"
import {OersiConfigContext} from "../../helpers/use-context"

jest.mock("@appbaseio/reactivesearch", () => ({
  DataSearch: () => <div />,
}))
jest.mock("react-router-dom", () => ({
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
      <OersiConfigContext.Provider
        value={{searchConfiguration: searchConfiguration}}
      >
        <SearchField />
      </OersiConfigContext.Provider>
    )
  })
})
