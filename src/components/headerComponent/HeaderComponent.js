import React from "react"
import "./headerComponent.css"
import {withTranslation} from "react-i18next"
import {Navbar, Nav} from "react-bootstrap"
import SearchComponent from "../searchComponent/SearchComponent"
/**
 * HeaderComponent
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const HeaderComponent = (props) => {
  return (
    <Navbar className="header" expand="lg">
      <div className="nav-bar-header">
        <Navbar.Brand>
          <h1>{props.t("HEADER.TITLE")}</h1>
        </Navbar.Brand>
        <Navbar.Text>
          <p>
            <b>{<b>{props.t("HEADER.SUBTITLE")}</b>}</b>
          </p>
        </Navbar.Text>
        {props.isMobile === false && <SearchComponent />}
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {props.isMobile === true && <SearchComponent />}
          {props.children}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default withTranslation()(HeaderComponent)
