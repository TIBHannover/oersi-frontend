import React from "react"
import {useTranslation} from "react-i18next"

import SearchField from "./SearchField"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import {Route, Routes, useNavigate} from "react-router"
import {
  ArrowLeftShortIcon,
  CircleHalfIcon,
  FilterIcon,
  MoonStarsFillIcon,
  SunIcon,
} from "./CustomIcons"

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
function ColorModeIcon(props) {
  const {colorMode} = props
  if (colorMode === "light") {
    return <SunIcon className={props.className} />
  } else if (colorMode === "dark") {
    return <MoonStarsFillIcon className={props.className} />
  } else {
    return <CircleHalfIcon className={props.className} />
  }
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
  const {onToggleFilterViewOpen, colorMode, isDarkMode} = frontendConfig

  const additionalNavItems =
    frontendConfig.ADDITIONAL_NAV_LINKS?.map((item) =>
      getValueForCurrentLanguage((lng) => item[lng], i18n)
    ) || []
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
    <Navbar expand="lg" className="bg-body-tertiary z-3" fixed="top">
      <Container fluid>
        <Routes>
          <Route
            path="/"
            element={
              <Nav>
                <Nav.Link
                  className="rounded-circle d-inline-flex"
                  aria-label="open filter drawer"
                  variant="secondary"
                  size="sm"
                  onClick={onToggleFilterViewOpen}
                >
                  <FilterIcon className="fs-3 lh-1" />
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
                  <ArrowLeftShortIcon className="fs-3 lh-1" />
                </Nav.Link>
              </Nav>
            }
          />
        </Routes>
        <Navbar.Brand href={frontendConfig.PUBLIC_URL} aria-label="SIDRE-TITLE">
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
          <span className="ps-2 navbar-brand__name sidre-header-title align-middle">
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
          <Nav className="ms-auto" as="ul">
            {additionalNavItems.map((item) => (
              <Nav.Item as="li" key={item["label"]}>
                <Nav.Link aria-label={"to " + item["label"]} href={item["url"]}>
                  {item["label"]}
                </Nav.Link>
              </Nav.Item>
            ))}
            <NavDropdown
              title={currentSupportedLanguage}
              aria-label="select language"
              align="end"
              as="li"
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
              title={<ColorModeIcon colorMode={colorMode} />}
              aria-label="select color mode"
              align="end"
              as="li"
            >
              <NavDropdown.Item
                active={colorMode === "light"}
                onClick={() => frontendConfig.onChangeColorMode("light")}
              >
                <ColorModeIcon colorMode="light" className="opacity-50 me-2" />
                {t("LABEL.LIGHT_MODE")}
              </NavDropdown.Item>
              <NavDropdown.Item
                active={colorMode === "dark"}
                onClick={() => frontendConfig.onChangeColorMode("dark")}
              >
                <ColorModeIcon colorMode="dark" className="opacity-50 me-2" />
                {t("LABEL.DARK_MODE")}
              </NavDropdown.Item>
              <NavDropdown.Item
                active={colorMode === "auto"}
                onClick={() => frontendConfig.onChangeColorMode("auto")}
              >
                <ColorModeIcon colorMode="auto" className="opacity-50 me-2" />
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
