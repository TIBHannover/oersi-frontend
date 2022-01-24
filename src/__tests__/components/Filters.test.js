import React from "react"
import {render, screen} from "@testing-library/react"
import Filters from "../../components/Filters"
import config from "react-global-configuration"
import prod from "../../config/prod"
import {OersiConfigContext} from "../../helpers/use-context"
import userEvent from "@testing-library/user-event";

jest.mock("../../components/MultiSelectionFilter", () => () => (
  <div className="multiList" />
))
jest.mock("@appbaseio/reactivesearch", () => ({
  StateProvider: () => <div />,
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

beforeEach(() => {
  config.set(prod, {freeze: false})
})
const defaultConfig = {
  filterSidebarWidth: 300,
}

describe("Filters ==> Test UI", () => {
  it("Filters : should render with open view", () => {
    const {container} = render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={true} isMobile={false} />
      </OersiConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should render with closed view", () => {
    const {container} = render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={false} isMobile={false} />
      </OersiConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should render with open mobile view", () => {
    const {container} = render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={true} isMobile={true} />
      </OersiConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should render with closed mobile view", () => {
    const {container} = render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={false} isMobile={true} />
      </OersiConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should close view", () => {
    const mock = jest.fn()
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={true} isMobile={true} onClose={mock} />
      </OersiConfigContext.Provider>
    )
    const closeButton = screen.getByRole("button", {name: "FILTER.SHOW_RESULTS"})
    userEvent.click(closeButton)
    expect(mock).toBeCalled()
  })
})
