import React from "react"
import {render, screen} from "@testing-library/react"
import {ThemeProvider} from "@mui/material"

import {customTheme} from "../../Configuration"
import PageControl from "../../components/PageControl"
import userEvent from "@testing-library/user-event"

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

describe("PageControl ==> Test UI  ", () => {
  it("PageControl : should render", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <PageControl
          page={1}
          total={10}
          pageSizeOptions={[12, 24]}
          pageSize={12}
          onChangePage={() => {}}
          onChangePageSize={() => {}}
        />
      </ThemeProvider>
    )
    expect(
      screen.queryByRole("navigation", {name: "pagination navigation"})
    ).toBeInTheDocument()
  })

  it("PageControl : empty content", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <PageControl
          page={0}
          total={0}
          pageSizeOptions={[12, 24]}
          pageSize={12}
          onChangePage={() => {}}
          onChangePageSize={() => {}}
        />
      </ThemeProvider>
    )
    expect(
      screen.queryByRole("navigation", {name: "pagination navigation"})
    ).toBeInTheDocument()
  })

  it("PageControl : call callback after page change", () => {
    const mock = jest.fn()
    render(
      <ThemeProvider theme={customTheme}>
        <PageControl
          page={1}
          total={100}
          pageSizeOptions={[12, 24]}
          pageSize={12}
          onChangePage={mock}
          onChangePageSize={() => {}}
        />
      </ThemeProvider>
    )
    const pageTwoButton = screen.getByRole("button", {name: "Go to page 2"})
    userEvent.click(pageTwoButton)
    expect(mock).toBeCalled()
  })

  it("PageControl : call callback after page size change", () => {
    const mock = jest.fn()
    render(
      <ThemeProvider theme={customTheme}>
        <PageControl
          page={1}
          total={100}
          pageSizeOptions={[12, 24]}
          pageSize={12}
          onChangePage={() => {}}
          onChangePageSize={mock}
        />
      </ThemeProvider>
    )
    const pageSizeButton = screen.getByRole("button", {
      name: "RESULT_LIST.PAGE_SIZE_SELECTION",
    })
    userEvent.click(pageSizeButton)
    const options = screen.getAllByRole("option")
    userEvent.click(options[1])
    expect(mock).toBeCalled()
  })
})
