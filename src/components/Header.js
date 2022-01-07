import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap"

import "./Header.css"
import SearchField from "./SearchField"
import {OersiConfigContext} from "../helpers/use-context"
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import {Translate} from "@mui/icons-material"

/**
 * Header
 * @author Edmond Kacaj <edmondikacaj@gmail.com>  {`${process.env.PUBLIC_URL}/nav-bar.png`}
 * @param {*} props properties
 */
const Header = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const {t, i18n} = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const availableLanguages = oersiConfig.AVAILABLE_LANGUAGES.sort((a, b) =>
    t("HEADER.CHANGE_LANGUAGE." + a).localeCompare(t("HEADER.CHANGE_LANGUAGE." + b))
  )

  const toggle = () => setIsOpen(!isOpen)

  const MuiBar = () => {
    const theme = useTheme()
    const [anchorElLanguage, setAnchorElLanguage] = React.useState(null)

    const handleOpenLanguageMenu = (event) => {
      setAnchorElLanguage(event.currentTarget)
    }
    const handleCloseLanguageMenu = () => {
      setAnchorElLanguage(null)
    }

    return (
      <Box sx={{flexGrow: 1}}>
        <AppBar
          color={"default"}
          position="static"
          sx={{marginBottom: theme.spacing(2)}}
        >
          <Toolbar>
            <Link href="/" sx={{p: 1}}>
              <Box
                component="img"
                sx={{
                  height: 50,
                  width: 50,
                }}
                alt="OERSI logo"
                src={`${process.env.PUBLIC_URL}/nav-bar.png`}
              />
            </Link>
            <Button
              href="/"
              sx={{
                color: theme.palette.text.primary,
                ":hover": {color: theme.palette.text.primary},
                display: {xs: "none", sm: "block"},
              }}
            >
              <Typography variant="h4" noWrap component="div">
                {t("HEADER.TITLE")}
              </Typography>
            </Button>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: {xs: "none", md: "block"},
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
              }}
            >
              {t("HEADER.SUBTITLE")}
            </Typography>
            <Box sx={{flexGrow: 1}} />
            <Box sx={{flexGrow: 3, p: 1}}>
              <SearchField />
            </Box>
            <Box sx={{flexGrow: 1}} />
            <IconButton
              size="large"
              aria-label="select language"
              aria-controls="menu-appbar-language"
              aria-haspopup="true"
              onClick={handleOpenLanguageMenu}
              color="inherit"
            >
              <Translate />
            </IconButton>
            <Menu
              id="menu-appbar-language"
              anchorEl={anchorElLanguage}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              open={Boolean(anchorElLanguage)}
              onClose={handleCloseLanguageMenu}
            >
              {availableLanguages.map((l) => (
                <MenuItem
                  key={l}
                  disabled={l === i18n.language}
                  onClick={() => i18n.changeLanguage(l)}
                >
                  {t("HEADER.CHANGE_LANGUAGE." + l)}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
  const ReactsTrapBar = () => {
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
            {availableLanguages
              .filter((l) => l !== i18n.language)
              .map((l) => (
                <NavItem key={l}>
                  <NavLink className="p-2" onClick={() => i18n.changeLanguage(l)}>
                    {t("HEADER.CHANGE_LANGUAGE." + l)}
                  </NavLink>
                </NavItem>
              ))}
          </Nav>
        </Collapse>
      </Navbar>
    )
  }

  return oersiConfig.FEATURES.HEADER_TYPE === "mui" ? <MuiBar /> : <ReactsTrapBar />
}

export default Header
