import React from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import FooterComponent from "../../../components/footerComponent/FooterComponent"
const footerFakeData = {
  footerLinks: [
    {
      title: "About",
      links: [
        {
          text: "Impressum",
          link: "https://www.tib.eu/de/service/impressum",
        },
        {
          text: "Datenschutz",
          link: "https://www.tib.eu/de/service/datenschutz",
        },
      ],
    },
    {
      title: "Technisch",
      links: [
        {
          text: "GitLab",
          link: "https://gitlab.com/oersi",
        },
        {
          text: "Issues",
          link: "https://gitlab.com/groups/oersi/-/issues",
        },
      ],
    },
  ],
  footerImage: [
    {
      image: "TIB_Logo_en.png",
      link: "https://www.tib.eu/de/",
    },
    {
      image: "Hbz-Logo.svg",
      link: "https://www.hbz-nrw.de/",
    },
  ],
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(footerFakeData),
  })
)
// jest.setTimeout(3000);
let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("FooterComponent ==> Test UI  ", () => {
  it("FooterComponent : should render without crashing", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(<FooterComponent />, div)
    })

    ReactDOM.unmountComponentAtNode(div)
  })
})
