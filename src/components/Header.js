import React from "react"
import {useTranslation} from "react-i18next"

import "./Header.css"
import SearchField from "./SearchField"
import {OersiConfigContext} from "../helpers/use-context"
import {
  AppBar,
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"

/**
 * Header
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const Header = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const {t, i18n} = useTranslation()
  const availableLanguages = oersiConfig.AVAILABLE_LANGUAGES.sort((a, b) =>
    t("HEADER.CHANGE_LANGUAGE." + a).localeCompare(t("HEADER.CHANGE_LANGUAGE." + b))
  )
  const theme = useTheme()
  const [anchorElLanguage, setAnchorElLanguage] = React.useState(null)
  const isSmallLogo = useMediaQuery(theme.breakpoints.down("sm"))
  const isDarkMode = theme.palette.mode === "dark"

  const handleOpenLanguageMenu = (event) => {
    setAnchorElLanguage(event.currentTarget)
  }
  const handleCloseLanguageMenu = () => {
    setAnchorElLanguage(null)
  }

  function getLogoUrl() {
    if (oersiConfig.HEADER_LOGO_URL) {
      let url = oersiConfig.HEADER_LOGO_URL
      url = url.replace("{{small}}", isSmallLogo ? "_small" : "")
      url = url.replace("{{dark}}", isDarkMode ? "_dark" : "")
      return url
    }
    return `${process.env.PUBLIC_URL}/logo-192.png`
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
              className={"oersi-header-logo" + isSmallLogo ? "-mobile" : ""}
              component="img"
              sx={{
                height: 50,
                width: 50,
              }}
              alt={"OERSI logo"}
              src={getLogoUrl()}
            />
          </Link>
          {oersiConfig.SHOW_HEADER_TITLE && (
            <Button
              aria-label="OERSI-TITLE"
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
          )}
          <Box sx={{flexGrow: 1}} />
          <Box sx={{flexGrow: 3, p: 1}}>
            <SearchField />
          </Box>
          <Box sx={{flexGrow: 1}} />
          <Button
            size="large"
            aria-label="select language"
            aria-controls="menu-appbar-language"
            aria-haspopup="true"
            onClick={handleOpenLanguageMenu}
            color="inherit"
          >
            {i18n.language}
          </Button>
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

export default Header
