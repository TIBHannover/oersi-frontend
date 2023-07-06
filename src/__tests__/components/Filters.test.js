import React from "react"
import {render, screen} from "@testing-library/react"
import Filters from "../../components/Filters"
import searchConfiguration from "../../config/SearchConfiguration"
import {OersiConfigContext} from "../../helpers/use-context"
import userEvent from "@testing-library/user-event"

jest.mock("../../components/MultiSelectionFilter", () => () => (
  <div className="multiList" />
))
jest.mock("../../components/SwitchFilter", () => () => (
  <div className="switchList" />
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

const defaultConfig = {
  filterSidebarWidth: 300,
  ENABLED_FILTERS: [
    "about",
    "learningResourceType",
    "license",
    "author",
    "sourceOrganization",
    "language",
    "provider",
    "conditionsOfAccess",
  ],
  searchConfiguration: searchConfiguration,
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

  it("Filters : should close view", async () => {
    const mock = jest.fn()
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Filters open={true} isMobile={true} onClose={mock} />
      </OersiConfigContext.Provider>
    )
    const closeButton = screen.getByRole("button", {name: "FILTER.SHOW_RESULTS"})
    await userEvent.click(closeButton)
    expect(mock).toBeCalled()
  })
})
