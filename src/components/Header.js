import React from "react"
import {useTranslation} from "react-i18next"

import SearchField from "./SearchField"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import {Route, Routes, useNavigate} from "react-router"

function getValueForCurrentLanguage(callBackFunction, i18n) {
  let language = i18n?.resolvedLanguage
  let response = callBackFunction(language)
  if (!response) {
    for (let fallbackLanguage of i18n.languages.filter(
      (item) => item !== i18n.resolvedLanguage
    )) {
      response = callBackFunction(fallbackLanguage)
      if (response) break
    }
  }
  return response
}
/**
 * Header
 * @param {*} props properties
 */
const Header = (props) => {
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {t, i18n} = useTranslation()
  const navigate = useNavigate()
  const availableLanguages = frontendConfig.AVAILABLE_LANGUAGES.sort((a, b) =>
    t("HEADER.CHANGE_LANGUAGE." + a).localeCompare(t("HEADER.CHANGE_LANGUAGE." + b))
  )
  const currentSupportedLanguage = i18n.languages.find((l) =>
    availableLanguages.includes(l)
  )
  const {
    onToggleDesktopFilterViewOpen,
    onToggleMobileFilterViewOpen,
    colorMode,
    isDarkMode,
  } = frontendConfig

  const externalInfoUrl =
    frontendConfig.EXTERNAL_INFO_LINK &&
    getValueForCurrentLanguage((lng) => frontendConfig.EXTERNAL_INFO_LINK[lng], i18n)
  function getLogoUrl(dark = false, small = false) {
    if (frontendConfig.HEADER_LOGO_URL) {
      let url = frontendConfig.HEADER_LOGO_URL
      url = url.replace("{{small}}", small ? "_small" : "")
      url = url.replace("{{dark}}", dark ? "_dark" : "")
      return url
    }
    return `${process.env.PUBLIC_URL}/logo-192.png`
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary z-3" sticky="top">
      <Container fluid>
        <Routes>
          <Route
            path="/"
            element={
              <Nav>
                <Nav.Link
                  className="rounded-circle d-none d-md-inline-flex"
                  aria-label="open sidebar filter drawer"
                  variant="secondary"
                  size="sm"
                  onClick={onToggleDesktopFilterViewOpen}
                >
                  <i className="bi bi-filter-circle-fill fs-3 lh-1" />
                </Nav.Link>
                <Nav.Link
                  className="rounded-circle d-inline-flex d-md-none"
                  aria-label="open fullscreen filter drawer"
                  variant="secondary"
                  size="sm"
                  onClick={onToggleMobileFilterViewOpen}
                >
                  <i className="bi bi-filter-circle-fill fs-3 lh-1" />
                </Nav.Link>
              </Nav>
            }
          />
          <Route
            path="/*"
            element={
              <Nav>
                <Nav.Link
                  aria-label="back to previous page"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left-short fs-3 lh-1" />
                </Nav.Link>
              </Nav>
              // <Button
              //   className="rounded-circle"
              //   aria-label="back to previous page"
              //   variant="secondary"
              //   size="sm"
              //   onClick={() => navigate(-1)}
              // >
              //   <i className="bi bi-arrow-left fs-4" />
              // </Button>
            }
          />
        </Routes>
        <Navbar.Brand href={frontendConfig.PUBLIC_URL}>
          <span className="navbar-logo align-middle">
            <img
              className={
                "sidre-header-logo-mobile d-inline-block d-sm-none align-top"
              }
              width="38"
              height="38"
              alt="SIDRE logo mobile"
              src={getLogoUrl(isDarkMode, true)}
            />
            <img
              className={"sidre-header-logo d-none d-sm-inline-block align-top"}
              width="38"
              height="38"
              alt="SIDRE logo"
              src={getLogoUrl(isDarkMode, false)}
            />
          </span>
          <span className="navbar-brand__name sidre-header-title align-middle">
            {t("HEADER.TITLE")}
          </span>
        </Navbar.Brand>
        <div className="flex-grow-1" />
        <div style={{flexGrow: 3}}>
          <SearchField />
        </div>
        <div className="flex-grow-1" />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {externalInfoUrl && (
              <Nav.Link aria-label={"to info pages"} href={externalInfoUrl}>
                {t("HEADER.INFO")}
              </Nav.Link>
            )}
            <NavDropdown
              title={currentSupportedLanguage}
              id="basic-nav-dropdown"
              align="end"
            >
              {availableLanguages.map((l) => (
                <NavDropdown.Item
                  key={l}
                  active={l === i18n.resolvedLanguage}
                  onClick={() => i18n.changeLanguage(l)}
                >
                  {t("HEADER.CHANGE_LANGUAGE." + l)}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown
              title={<i className="bi bi-circle-half" />}
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item
                active={colorMode === "light"}
                onClick={() => frontendConfig.onChangeColorMode("light")}
              >
                <i className="bi bi-sun-fill opacity-50 me-2" />
                {t("LABEL.LIGHT_MODE")}
              </NavDropdown.Item>
              <NavDropdown.Item
                active={colorMode === "dark"}
                onClick={() => frontendConfig.onChangeColorMode("dark")}
              >
                <i className="bi bi-moon-stars-fill opacity-50 me-2" />
                {t("LABEL.DARK_MODE")}
              </NavDropdown.Item>
              <NavDropdown.Item
                active={colorMode === "auto"}
                onClick={() => frontendConfig.onChangeColorMode("auto")}
              >
                <i className="bi bi-circle-half opacity-50 me-2" />
                {t("LABEL.AUTO_MODE")}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
