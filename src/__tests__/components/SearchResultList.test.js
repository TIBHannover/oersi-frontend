import React from "react"
import SearchResultList from "../../components/SearchResultList"
import {render} from "@testing-library/react"
import {OersiConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router-dom"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"

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
            searchConfiguration: getDefaultSearchConfiguration(),
          }}
        >
          <SearchResultList />
        </OersiConfigContext.Provider>
      </MemoryRouter>
    )
  })
})
