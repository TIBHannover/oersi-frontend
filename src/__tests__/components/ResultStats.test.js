import React from "react"
import {render, screen} from "@testing-library/react"
import ResultStats from "../../components/ResultStats"
import {StateProvider} from "@appbaseio/reactivesearch"

jest.mock("@appbaseio/reactivesearch", () => ({
  StateProvider: jest.fn(),
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
    StateProvider.mockImplementation((props) =>
      props.render({
        searchState: {
          results: {
            isLoading: false,
          },
        },
      })
    )
    render(<ResultStats />)
    expect(screen.queryByLabelText("total-result", {})).toBeInTheDocument()
  })

  it("ResultStats : should render", () => {
    StateProvider.mockImplementation((props) =>
      props.render({
        searchState: {
          results: {
            isLoading: true,
          },
        },
      })
    )
    render(<ResultStats />)
    expect(
      screen.queryByRole("progressbar", {name: "loading-progress"})
    ).toBeInTheDocument()
  })
})
