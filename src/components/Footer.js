import React from "react"
import parse from "html-react-parser"
import {i18n} from "next-i18next"

const Footer = (props) => {
  const {html} = props

  return <div data-insert-template-id="footer-id">{parse(html)}</div>
}

export async function getFooterHtml(language) {
  let response = await fetchFooter(language)
  if (response.error) {
    for (let fallbackLanguage of i18n.languages.filter(
      (item) => item !== i18n.language
    )) {
      response = await fetchFooter(fallbackLanguage)
      if (!response.error) break
    }
  }
  return response
}

async function fetchFooter(lang) {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_PUBLIC_URL}/footer/${lang}/footer.html`,
    {
      credentials: "same-origin",
    }
  )
  if (result.status === 200) {
    const htmlResponse = await result.text()
    if (
      !htmlResponse.includes("html") ||
      !htmlResponse.includes("head") ||
      !htmlResponse.includes("body")
    ) {
      return {
        error: false,
        html: htmlResponse,
      }
    } else {
      return {
        error: true,
      }
    }
  } else {
    return {
      error: true,
    }
  }
}

export default Footer
