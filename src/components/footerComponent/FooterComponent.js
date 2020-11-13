import React, {useState, useEffect} from "react"
import "./FooterComponent.css"
import {withTranslation} from "react-i18next"
import {getConfiguration} from "../../service/configuration/configurationService"
import PropTypes from "prop-types"
import parse from "html-react-parser"

/**
 * This is the Footer component, You can use different url and image after Build
 * use Fetsch to call public/footer/config.json to load data
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */

const FooterComponent = () => {
  const [data, setdata] = useState("")
  const [isLoaded, setisLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await getConfiguration("/footer/footer.html")
      const htmlResponse = await res.text()
      if (
        !htmlResponse.includes("html") ||
        !htmlResponse.includes("head") ||
        !htmlResponse.includes("body")
      ) {
        setdata(htmlResponse)
        setisLoaded(true)
      } else {
        setisLoaded(false)
      }
    }
    fetchData()
  }, [])

  return <div data-insert-template-id="footer-id">{isLoaded && parse(data)}</div>
}

FooterComponent.propTypes = {
  data: PropTypes.object,
  isLoaded: PropTypes.bool,
}

export default withTranslation()(FooterComponent)
