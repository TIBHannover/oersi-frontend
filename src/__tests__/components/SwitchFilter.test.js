import React from "react"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {OersiConfigContext} from "../../helpers/use-context"
import SwitchFilter from "../../components/SwitchFilter"
import {MemoryRouter} from "react-router-dom"

const mockData = jest.fn()
jest.mock("@appbaseio/reactivesearch", () => ({
  SingleDataList: (props) => (
    <>
      <div>{props.children(mockData(props))}</div>
    </>
  ),
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => "X",
      i18n: {
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
const filterItemsData = {
  component: "conditionsOfAccess",
  data: [
    {
      value: testData.switchableFieldValue,
      label: testData.switchableFieldValue,
      count: "3",
    },
  ],
  value: testData.switchableFieldValue,
}
const defaultConfig = {}
describe("SwitchFilter ==> Test UI", () => {
  const FilterWithConfig = (props) => {
    return (
      <MemoryRouter
        initialEntries={
          props.initialRouterEntries ? props.initialRouterEntries : ["/"]
        }
      >
        <OersiConfigContext.Provider
          value={props.appConfig ? props.appConfig : defaultConfig}
        >
          <SwitchFilter {...props} />
        </OersiConfigContext.Provider>
      </MemoryRouter>
    )
  }
  const mockDefaultData = () => {
    mockData.mockImplementation((props) => {
      return {
        data: filterItemsData.data,
        value: props.value,
        handleChange: () => {},
      }
    })
  }
  it("Filters : click on checkbox should change value", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const checkbox = screen.getByRole("checkbox", {name: "X 3"})
    expect(checkbox).toHaveProperty("checked", false)
    await userEvent.click(checkbox)
    expect(checkbox).toHaveProperty("checked", true)
  })
})
