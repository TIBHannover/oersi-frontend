import React, {useEffect, useState} from "react"
import parse from "html-react-parser"
import {i18n} from "next-i18next"

const Footer = (props) => {
  const [html, setHtml] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadFooterHtml(i18n.language)
  }, [i18n?.language])

  async function loadFooterHtml(language) {
    let response = await fetchFooter(language)
    if (response.error) {
      for (let fallbackLanguage of i18n?.languages.filter(
        (item) => item !== i18n?.language
      )) {
        response = await fetchFooter(fallbackLanguage)
        if (!response.error) break
      }
    }
    if (!response.error) {
      setIsLoaded(true)
      setHtml(response.html)
    }
  }

  return <div data-insert-template-id="footer-id">{isLoaded && parse(html)}</div>
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
