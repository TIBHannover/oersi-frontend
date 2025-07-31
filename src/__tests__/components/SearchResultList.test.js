import React from "react"
import SearchResultList from "../../components/SearchResultList"
import {render} from "@testing-library/react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"

const defaultConfig = {
  GENERAL_CONFIGURATION: {
    RESULT_PAGE_SIZE_OPTIONS: ["12", "24"],
    NR_OF_RESULT_PER_PAGE: 12,
  },
}

jest.mock("react-instantsearch", () => ({
  useHits: () => ({result: {hitsPerPage: 12}, items: []}),
  useHitsPerPage: () => ({refine: jest.fn()}),
  usePagination: () => ({nbHits: 100, currentRefinement: 0, refine: jest.fn()}),
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        t: (str) => str,
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe("SearchResultList ==> Test UI  ", () => {
  it("SearchResultList : should render correctly", () => {
    render(
      <MemoryRouter>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            ...defaultConfig.GENERAL_CONFIGURATION,
            searchConfiguration: getDefaultSearchConfiguration(),
          }}
        >
          <SearchResultList />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
  })
})
