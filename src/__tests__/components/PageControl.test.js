import React from "react"
import {render, screen} from "@testing-library/react"
import {ThemeProvider} from "@mui/material"

import {getTheme} from "../../Configuration"
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
      <ThemeProvider theme={getTheme()}>
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
      <ThemeProvider theme={getTheme()}>
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

  it("PageControl : call callback after page change", async () => {
    const mock = jest.fn()
    render(
      <ThemeProvider theme={getTheme()}>
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
    await userEvent.click(pageTwoButton)
    expect(mock).toBeCalled()
  })

  it("PageControl : call callback after page size change", async () => {
    const mock = jest.fn()
    render(
      <ThemeProvider theme={getTheme()}>
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
    await userEvent.click(pageSizeButton)
    const options = screen.getAllByRole("option")
    await userEvent.click(options[1])
    expect(mock).toBeCalled()
  })

  it("PageControl : disable buttons for pages after max-page (index limits scrollable results)", async () => {
    const mock = jest.fn()
    render(
      <ThemeProvider theme={getTheme()}>
        <PageControl
          page={104}
          total={11000}
          pageSizeOptions={[12, 24, 96]}
          pageSize={96}
          onChangePage={mock}
          onChangePageSize={() => {}}
        />
      </ThemeProvider>
    )
    const lastPageButton = screen.getByRole("button", {name: "Go to page 115"})
    expect(lastPageButton).toBeDisabled()
    const nextPageButton = screen.getByRole("button", {name: "Go to next page"})
    expect(nextPageButton).toBeDisabled()
  })
})
