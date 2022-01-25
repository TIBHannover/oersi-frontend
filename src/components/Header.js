import React from "react"
import {useTranslation} from "react-i18next"

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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import {ArrowBack} from "@mui/icons-material"
import {Route, Switch, useHistory} from "react-router-dom"

/**
 * Header
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const Header = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const {t, i18n} = useTranslation()
  const history = useHistory()
  const availableLanguages = oersiConfig.AVAILABLE_LANGUAGES.sort((a, b) =>
    t("HEADER.CHANGE_LANGUAGE." + a).localeCompare(t("HEADER.CHANGE_LANGUAGE." + b))
  )
  const theme = useTheme()
  const [anchorElLanguage, setAnchorElLanguage] = React.useState(null)
  const {onToggleFilterView} = props
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
      <Box // placeholder to fill space under fixed appbar
        sx={{
          // height of the app bar is determined by the image-height (50px) plus 1-theme-padding on top and bottom
          minHeight: `calc(50px + ${theme.spacing(2)})`,
          marginBottom: theme.spacing(2),
        }}
      />
      <AppBar color={"default"} position="fixed" sx={{zIndex: 1300}}>
        <Toolbar>
          <Switch>
            <Route exact path="/">
              <IconButton
                color="inherit"
                aria-label="open sidebar drawer"
                onClick={onToggleFilterView}
                edge="start"
              >
                <FilterListIcon fontSize="large" />
              </IconButton>
            </Route>
            <Route>
              <IconButton
                color="inherit"
                aria-label="back to previous page"
                onClick={() => history.goBack()}
                edge="start"
              >
                <ArrowBack fontSize="large" />
              </IconButton>
            </Route>
          </Switch>
          <Link href="/" sx={{p: 1}}>
            <Box
              className={"oersi-header-logo" + (isSmallLogo ? "-mobile" : "")}
              component="img"
              sx={{
                display: "block",
                height: 50,
                width: 50,
              }}
              alt="OERSI logo"
              src={getLogoUrl()}
            />
          </Link>
          <Button
            className="oersi-header-title"
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
