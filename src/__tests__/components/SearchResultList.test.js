import React from "react"
import SearchResultList from "../../components/SearchResultList"
import {render} from "@testing-library/react"
import searchConfiguration from "../../config/SearchConfiguration"
import {OersiConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router-dom"

const defaultConfig = {
  GENERAL_CONFIGURATION: {
    NR_OF_RESULT_PER_PAGE: 12,
  },
}

jest.mock("@appbaseio/reactivesearch", () => ({
  ReactiveList: () => <div />,
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
  withTranslation: () => (Component) => {
    Component.defaultProps = {...Component.defaultProps, t: () => ""}
    return Component
  },
}))

describe("SearchResultList ==> Test UI  ", () => {
  it("SearchResultList : should render correctly", () => {
    render(
      <MemoryRouter>
        <OersiConfigContext.Provider
          value={{
            ...defaultConfig.GENERAL_CONFIGURATION,
            searchConfiguration: searchConfiguration,
          }}
        >
          <SearchResultList />
        </OersiConfigContext.Provider>
      </MemoryRouter>
    )
  })
})
