import React, {useEffect, useState} from "react"
import parse from "html-react-parser"
import {i18n} from "next-i18next"
import {Box, useTheme} from "@mui/material"

const Footer = (props) => {
  const theme = useTheme()
  const [html, setHtml] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadFooterHtml(i18n.resolvedLanguage)
  }, [i18n?.resolvedLanguage])

  async function loadFooterHtml(language) {
    let response = await fetchFooter(language)
    if (response.error) {
      for (let fallbackLanguage of i18n?.languages.filter(
        (item) => item !== i18n?.resolvedLanguage
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

  return (
    <Box
      data-insert-template-id="footer-id"
      sx={{fontSize: theme.typography.fontSize}}
    >
      {isLoaded && parse(html)}
    </Box>
  )
}

async function fetchFooter(lang) {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/footer/${lang}/footer.html`,
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
