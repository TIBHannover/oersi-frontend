import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import parse from "html-react-parser"

import {getRequest} from "../api/configuration/configurationService"
import {getRequestWithLanguage} from "../helpers/helpers"

const Footer = () => {
  const {i18n} = useTranslation()
  const [data, setdata] = useState("")
  const [isLoaded, setisLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      await getRequestWithLanguage(callBackForRequest, i18n)
    }
    fetchData()
  }, [i18n, i18n.language])

  async function callBackForRequest(lang) {
    const result = await getRequest(`/footer/${lang}/footer.html`)
    if (result.status === 200) {
      const htmlResponse = await result.text()
      if (
        !htmlResponse.includes("html") ||
        !htmlResponse.includes("head") ||
        !htmlResponse.includes("body")
      ) {
        setdata(htmlResponse)
        setisLoaded(true)
        return true
      } else {
        setisLoaded(false)
        return false
      }
    } else {
      return false
    }
  }

  return <div data-insert-template-id="footer-id">{isLoaded && parse(data)}</div>
}

export default Footer
