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
  Row,
  Col,
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
        <NavbarBrand href="/" style={{width: "15%"}}>
          <Row>
            <Col>
              {" "}
              <h2 className="header-navbar-h2">{props.t("HEADER.TITLE")}</h2>{" "}
            </Col>
          </Row>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              {props.isMobile === false && (
                <h4 className="header-navbar-h4">{props.t("HEADER.SUBTITLE")}</h4>
              )}
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
