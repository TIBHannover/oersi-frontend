import React from "react"
import {render, screen} from "@testing-library/react"
import ResultStats from "../../components/ResultStats"

const mockUseInstantSearch = jest.fn()
jest.mock("react-instantsearch", () => ({
  useStats: () => {
    return {nbHits: 100}
  },
  useInstantSearch: () => mockUseInstantSearch(),
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

describe("ResultStats ==> Test UI", () => {
  it("ResultStats : should render", () => {
    mockUseInstantSearch.mockImplementation(() => ({status: "ok"}))
    render(<ResultStats />)
    expect(screen.queryByLabelText("total-result", {})).toBeInTheDocument()
  })

  it("ResultStats : should render", () => {
    mockUseInstantSearch.mockImplementation(() => ({status: "loading"}))
    render(<ResultStats />)
    expect(screen.queryByLabelText("loading-spinner")).toBeInTheDocument()
  })
})
