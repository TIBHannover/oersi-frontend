import React, {useState} from "react"
import "./Header.css"
import {useTranslation} from "react-i18next"
import SearchField from "./SearchField"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"
/**
 * Header
 * @author Edmond Kacaj <edmondikacaj@gmail.com>  {`${process.env.PUBLIC_URL}/nav-bar.png`}
 * @param {*} props properties
 */
const Header = (props) => {
  const {t, i18n} = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Navbar color="light" light expand="lg" style={{marginBottom: "20px"}}>
      <NavbarBrand href="/">
        <img
          src={`${process.env.PUBLIC_URL}/nav-bar.png`}
          srcSet={`${process.env.PUBLIC_URL}/nav-bar.png 512w, ${process.env.PUBLIC_URL}/nav-bar-100x100.png 100w, ${process.env.PUBLIC_URL}/nav-bar-50x50.png 50w`}
          alt="Brand logo"
          className="header-brand-img"
          sizes="50vw"
          width={50}
          height={50}
        />
      </NavbarBrand>
      <NavbarBrand href="/">
        <h1 className="mt-0 mb-0">{t("HEADER.TITLE")}</h1>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto d-none d-lg-block" navbar>
          <NavItem>
            <h4 className="p-2 mt-0 mb-0">{t("HEADER.SUBTITLE")}</h4>
          </NavItem>
        </Nav>
        <SearchField />
        {props.children}
        <Nav className="ml-auto" navbar>
          {i18n.language !== "en" && (
            <NavItem>
              <NavLink className="p-2" onClick={() => i18n.changeLanguage("en")}>
                {t("HEADER.CHANGE_LANGUAGE_ENGLISH")}
              </NavLink>
            </NavItem>
          )}
          {i18n.language !== "de" && (
            <NavItem>
              <NavLink className="p-2" onClick={() => i18n.changeLanguage("de")}>
                {t("HEADER.CHANGE_LANGUAGE_GERMAN")}
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header
