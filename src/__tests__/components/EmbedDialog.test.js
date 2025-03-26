import React from "react"
import EmbedDialog from "../../components/EmbedDialog"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

let dummyData = {
  id: 1,
  title: "Test",
  licenseGroup: "by-sa",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  author: ["Max Mustermann"],
}

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

describe("EmbedDialog", () => {
  it("Test click on copy button", async () => {
    navigator.clipboard = jest.fn(() => true)
    navigator.clipboard.writeText = jest.fn(() => true)
    render(<EmbedDialog open={true} onClose={jest.fn()} data={{...dummyData}} />)

    const button = screen.getByRole("button", {name: "LABEL.COPY"})
    await userEvent.click(button)
    expect(button).toHaveClass("embed-dialog-copy-done-button")
  })
  it("Test click on code tab", async () => {
    render(<EmbedDialog open={true} onClose={jest.fn()} data={{...dummyData}} />)

    const button = screen.getByRole("tab", {name: "EMBED_MATERIAL.CODE"})
    await userEvent.click(button)
    expect(screen.queryByRole("textbox")).toBeInTheDocument()
    expect(screen.getByRole("tabpanel", {name: "EMBED_MATERIAL.CODE"})).toBeVisible()
  })
})
