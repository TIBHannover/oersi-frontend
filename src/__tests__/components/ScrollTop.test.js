import React from "react"
import ScrollTop from "../../components/ScrollTop"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("ScrollTop", () => {
  it("ScrollTop click", async () => {
    let scrollIntoViewMock = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    render(<ScrollTop />)
    const fab = screen.getByRole("button", {name: /scroll back to top/i})
    await userEvent.click(fab)

    expect(scrollIntoViewMock).toBeCalled()
  })
})
