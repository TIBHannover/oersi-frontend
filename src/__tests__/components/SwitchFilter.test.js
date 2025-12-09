import React from "react"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import SwitchFilter from "../../components/SwitchFilter"
import {MemoryRouter} from "react-router"

const mockRefinements = jest.fn()
jest.mock("react-instantsearch", () => ({
  useToggleRefinement: () => mockRefinements(),
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => "X",
      i18n: {
        t: (str) => "X",
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))
const testData = {
  componentId: "conditionsOfAccess",
  dataField: "conditionsOfAccess.id",
  filterLabel: "CONDITIONS_OF_ACCESS",
  switchableFieldValue: "http://w3id.org/kim/conditionsOfAccess/no_login",
  defaultChecked: false,
}
const filterItemsData = {isRefined: false, count: 3}
const defaultConfig = {
  fieldConfiguration: {
    options: [
      {
        dataField: "conditionsOfAccess.id",
        translationNamespace: "labelledConcept",
      },
    ],
  },
}
describe("SwitchFilter ==> Test UI", () => {
  const FilterWithConfig = (props) => {
    return (
      <MemoryRouter
        initialEntries={
          props.initialRouterEntries ? props.initialRouterEntries : ["/"]
        }
      >
        <SearchIndexFrontendConfigContext.Provider
          value={props.appConfig ? props.appConfig : defaultConfig}
        >
          <SwitchFilter {...props} />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
  }
  let mockRefine
  const mockDefaultData = () => {
    mockRefine = jest.fn()
    mockRefinements.mockImplementation((props) => {
      return {
        value: filterItemsData,
        refine: mockRefine,
      }
    })
  }
  it("Filters : click on checkbox should change value", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const checkbox = screen.getByRole("checkbox", {name: "X 3"})
    expect(checkbox).toHaveProperty("checked", false)
    await userEvent.click(checkbox)
    expect(mockRefine).toBeCalledWith({isRefined: true})
  })
})
