import React from "react"
import {render, screen} from "@testing-library/react"

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
      <PageControl
        page={1}
        total={10}
        pageSizeOptions={[12, 24]}
        pageSize={12}
        onChangePage={() => {}}
        onChangePageSize={() => {}}
      />
    )
    expect(
      screen.queryByRole("navigation", {name: "pagination navigation"})
    ).toBeInTheDocument()
  })

  it("PageControl : empty content", () => {
    render(
      <PageControl
        page={0}
        total={0}
        pageSizeOptions={[12, 24]}
        pageSize={12}
        onChangePage={() => {}}
        onChangePageSize={() => {}}
      />
    )
    expect(
      screen.queryByRole("navigation", {name: "pagination navigation"})
    ).toBeInTheDocument()
  })

  it("PageControl : call callback after page change", async () => {
    const mock = jest.fn()
    render(
      <PageControl
        page={1}
        total={100}
        pageSizeOptions={[12, 24]}
        pageSize={12}
        onChangePage={mock}
        onChangePageSize={() => {}}
      />
    )
    const pageTwoButton = screen.getByRole("button", {name: "go to page 2"})
    await userEvent.click(pageTwoButton)
    expect(mock).toBeCalled()
  })

  it("PageControl : call callback after page size change", async () => {
    const mock = jest.fn()
    render(
      <PageControl
        page={1}
        total={100}
        pageSizeOptions={[12, 24]}
        pageSize={12}
        onChangePage={() => {}}
        onChangePageSize={mock}
      />
    )
    const pageSizeButton = screen.getByRole("button", {
      name: "RESULT_LIST.PAGE_SIZE_SELECTION",
    })
    await userEvent.click(pageSizeButton)
    const selectSizeTwelveButton = screen.getByRole("button", {
      name: "select page size 12",
    })
    await userEvent.click(selectSizeTwelveButton)
    expect(mock).toBeCalled()
  })

  it("PageControl : disable buttons for pages after max-page (index limits scrollable results)", async () => {
    const mock = jest.fn()
    render(
      <PageControl
        page={104}
        total={11000}
        pageSizeOptions={[12, 24, 96]}
        pageSize={96}
        onChangePage={mock}
        onChangePageSize={() => {}}
      />
    )
    const lastPageButton = screen.getByLabelText("go to page 115")
    expect(lastPageButton).not.toHaveRole("button")
    const nextPageButton = screen.getByLabelText("go to next page")
    expect(nextPageButton).not.toHaveRole("button")
  })
})
