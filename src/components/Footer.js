import React, {useEffect, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import parse from "html-react-parser"

import {concatPaths} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"

const Footer = () => {
  const {PUBLIC_BASE_PATH} = React.useContext(SearchIndexFrontendConfigContext)
  const {i18n} = useTranslation()
  const [data, setData] = useState("")
  const [loaded, setLoaded] = useState(false)

  const languages = useMemo(() => {
    let lngs
    let resolvedLanguage = i18n.resolvedLanguage
    if (resolvedLanguage) {
      lngs = [
        resolvedLanguage,
        ...i18n.languages.filter((item) => item !== resolvedLanguage),
      ]
    } else {
      lngs = i18n.languages
    }
    return lngs
  }, [i18n.languages, i18n.resolvedLanguage])

  useEffect(() => {
    async function callBackForRequest(lang) {
      const result = await fetch(
        concatPaths(PUBLIC_BASE_PATH, `/footer/${lang}/footer.html`)
      )
      if (result.status === 200) {
        const htmlResponse = await result.text()
        if (
          !htmlResponse.includes("html") ||
          !htmlResponse.includes("head") ||
          !htmlResponse.includes("body")
        ) {
          setData(htmlResponse)
          setLoaded(true)
          return true
        } else {
          setLoaded(false)
          return false
        }
      } else {
        return false
      }
    }
    async function fetchData() {
      for (let fallbackLanguage of languages) {
        const statusOK = await callBackForRequest(fallbackLanguage)
        if (statusOK) break
      }
    }
    fetchData()
  }, [PUBLIC_BASE_PATH, languages])

  return <div data-insert-template-id="footer-id">{loaded && parse(data)}</div>
}

export default Footer
