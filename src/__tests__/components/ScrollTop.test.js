import React from "react"
import ScrollTop from "../../components/ScrollTop"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

jest.mock("@mui/material", () => ({
  useScrollTrigger: () => true,
  useTheme: () => ({
    spacing: (n) => n,
  }),
}))

describe("ScrollTop", () => {
  it("ScrollTop click", () => {
    let scrollIntoViewMock = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    render(<ScrollTop />)
    const fab = screen.getByRole("button", {name: /scroll back to top/i})
    userEvent.click(fab)

    expect(scrollIntoViewMock).toBeCalled()
  })
})
