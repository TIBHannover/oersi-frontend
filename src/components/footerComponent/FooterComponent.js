import React, {useState, useEffect} from "react"
import "./FooterComponent.css"
import {withTranslation} from "react-i18next"
import {getConfiguration} from "../../service/configuration/configurationService"
import LinkComponent from "../linkComponent/LinkComponent"
import PropTypes from "prop-types"

/**
 * This is the Footer component, You can use different url and image after Build
 * use Fetsch to call public/footer/config.json to load data
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const FooterComponent = (props) => {
  const [data, setdata] = useState({})
  const [isLoaded, setisLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await getConfiguration("/footer/config.json")
      const json = await res.json()
      if (json != null) {
        setdata(json)
        setisLoaded(true)
      }
    }
    fetchData()
  }, [])

  return (
    <footer className="footer">
      {isLoaded ? (
        <div className="container-fluid">
          <br />
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-4 footer-block">
              <h5>{props.t("FOOTER.TITLE")}</h5>
              <hr />
              <div className="col-sm-12">
                <p className="fotter-p">{props.t("FOOTER.TEXT")}</p>
              </div>
            </div>
            {data.footerLinks !== "undefined" &&
              data.footerLinks.slice(0, 2).map((dataFooter, indexFooter) => (
                <div className="col-sm-3 footer-block" key={indexFooter}>
                  <h5>{dataFooter.title}</h5>
                  <hr />
                  <ul>
                    {dataFooter.links.map((dt, index) => (
                      <li key={index}>
                        <LinkComponent link={dt.link}>
                          <span>{dt.text}</span>
                        </LinkComponent>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <div className="col-sm-2"></div>
            <br />
            <div className="col-sm-8">
              <hr />
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-2"></div>
                {data.footerImage !== "undefined" &&
                  data.footerImage.slice(0, 3).map((dt, index) => (
                    <div className="col-sm-3" key={index}>
                      <LinkComponent link={dt.link}>
                        <img
                          className="img-block"
                          src={process.env.PUBLIC_URL + "/" + dt.image}
                          alt="LOGO"
                        />
                      </LinkComponent>
                    </div>
                  ))}
                <div className="col-sm-1"></div>
              </div>
            </div>
          </div>
          <p className="copyright pull-right">
            <b>© {new Date().getFullYear()}</b>
            {"  "}
            {props.t("FOOTER.COPY_RIGHT")}
          </p>
        </div>
      ) : (
        ""
      )}
    </footer>
  )
}

FooterComponent.propTypes = {
  data: PropTypes.object,
  isLoaded: PropTypes.bool,
}

export default withTranslation()(FooterComponent)
