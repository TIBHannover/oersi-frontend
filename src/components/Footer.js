import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import PropTypes from "prop-types"
import parse from "html-react-parser"

import {getRequest} from "../api/configuration/configurationService"
import {getRequestWithLanguage} from "../helpers/helpers"
import {Box, useTheme} from "@mui/material"

/**
 * This is the Footer component, You can use different url and image after Build
 * use Fetsch to call public/footer/config.json to load data
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */

const Footer = () => {
  const {i18n} = useTranslation()
  const theme = useTheme()
  const [data, setdata] = useState("")
  const [isLoaded, setisLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      await getRequestWithLanguage(callBackForRequest, i18n)
    }
    fetchData()
  }, [i18n])

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

  return (
    <Box
      data-insert-template-id="footer-id"
      sx={{fontSize: theme.typography.fontSize}}
    >
      {isLoaded && parse(data)}
    </Box>
  )
}

Footer.propTypes = {
  data: PropTypes.object,
  isLoaded: PropTypes.bool,
}

export default Footer
