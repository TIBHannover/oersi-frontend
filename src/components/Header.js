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
  const logoUrl = oersiConfig.HEADER_LOGO_URL
    ? oersiConfig.HEADER_LOGO_URL
    : `${process.env.PUBLIC_URL}/logo-192.png`
  const logoMobileUrl = oersiConfig.HEADER_LOGO_MOBILE_URL
    ? oersiConfig.HEADER_LOGO_MOBILE_URL
    : `${process.env.PUBLIC_URL}/logo-192.png`

  const handleOpenLanguageMenu = (event) => {
    setAnchorElLanguage(event.currentTarget)
  }
  const handleCloseLanguageMenu = () => {
    setAnchorElLanguage(null)
  }

  function getLogo(url, className, display) {
    return (
      <Box
        className={className}
        component="img"
        sx={{
          display: display,
          height: 50,
          width: 50,
        }}
        alt={"OERSI logo" + (className.includes("mobile") ? " mobile" : "")}
        src={url}
      />
    )
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
            {getLogo(logoMobileUrl, "oersi-header-logo-mobile", {
              xs: "block",
              sm: "none",
            })}
            {getLogo(logoUrl, "oersi-header-logo", {xs: "none", sm: "block"})}
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
