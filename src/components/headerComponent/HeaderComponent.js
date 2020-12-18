import React, {useState} from "react"
import "./headerComponent.css"
import {withTranslation} from "react-i18next"
import SearchComponent from "../searchComponent/SearchComponent"
import {
  Collapse,
  Navbar,
  CardImg,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap"
/**
 * HeaderComponent
 * @author Edmond Kacaj <edmondikacaj@gmail.com>  {`${process.env.PUBLIC_URL}/nav-bar.png`}
 * @param {*} props properties
 */
const HeaderComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div>
      <Navbar color="light" light expand="lg">
        <NavbarBrand href="/">
          <CardImg
            src={`${process.env.PUBLIC_URL}/nav-bar.png`}
            alt="Card image cap"
          />
        </NavbarBrand>
        <NavbarBrand href="/">
          <h2 className="header-navbar-h2 mt-0 mb-0">{props.t("HEADER.TITLE")}</h2>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto d-none d-lg-block" navbar>
            <NavItem>
              <h4 className="p-2 mt-0 mb-0">{props.t("HEADER.SUBTITLE")}</h4>
            </NavItem>
          </Nav>
          <SearchComponent />
          {props.children}
        </Collapse>
      </Navbar>
    </div>
  )
}

export default withTranslation()(HeaderComponent)
