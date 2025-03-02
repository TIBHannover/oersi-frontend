import React from "react"
import {useTranslation} from "react-i18next"

import SearchField from "./SearchField"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import {
  ArrowBack,
  DarkMode,
  ExpandLess,
  ExpandMore,
  LightMode,
  MoreVert,
  Tune,
} from "@mui/icons-material"
import {Route, Routes, useNavigate} from "react-router"

const NestedMenuItem = (props) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const {title, children} = props

  return (
    <>
      <MenuItem onClick={() => setOpen(!open)}>
        <Typography>{title}</Typography>
        {open ? (
          <ExpandLess sx={{marginLeft: "auto"}} />
        ) : (
          <ExpandMore sx={{marginLeft: "auto"}} />
        )}
      </MenuItem>
      <Collapse in={open}>
        <MenuList sx={{marginX: theme.spacing(2)}}>{children}</MenuList>
      </Collapse>
    </>
  )
}

const MenuButton = (props) => {
  const {title, icon, text, menuItems} = props
  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    <>
      {icon ? (
        <IconButton
          aria-label={"select " + title}
          aria-controls={"menu-appbar-" + title}
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {icon}
        </IconButton>
      ) : (
        <Button
          size="large"
          aria-label={"select " + title}
          aria-controls={"menu-appbar-" + title}
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          color="inherit"
        >
          {text}
        </Button>
      )}
      <Menu
        id={"menu-appbar-" + title}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems}
      </Menu>
    </>
  )
}

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
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
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
  const theme = useTheme()
  const {onToggleDesktopFilterViewOpen, onToggleMobileFilterViewOpen} =
    frontendConfig
  const isDarkMode = theme.palette.mode === "dark"

  const externalInfoUrl =
    frontendConfig.EXTERNAL_INFO_LINK &&
    getValueForCurrentLanguage((lng) => frontendConfig.EXTERNAL_INFO_LINK[lng], i18n)
  const languageMenuItems = availableLanguages.map((l) => (
    <MenuItem
      key={l}
      disabled={l === i18n.resolvedLanguage}
      onClick={() => i18n.changeLanguage(l)}
    >
      {t("HEADER.CHANGE_LANGUAGE." + l)}
    </MenuItem>
  ))
  const settingsMenuItems = [
    frontendConfig.FEATURES?.DARK_MODE && (
      <MenuItem key="ColorMode" onClick={frontendConfig.onToggleColorMode}>
        <ListItemIcon>{isDarkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
        <ListItemText>
          {isDarkMode ? t("LABEL.LIGHT_MODE") : t("LABEL.DARK_MODE")}
        </ListItemText>
      </MenuItem>
    ),
    frontendConfig.FEATURES?.CHANGE_FONTSIZE && (
      <MenuItem key="FontSize">
        <Button onClick={() => frontendConfig.onChangeFontSize(12)}>12</Button>
        <Button onClick={() => frontendConfig.onChangeFontSize(14)}>14</Button>
        <Button onClick={() => frontendConfig.onChangeFontSize(16)}>16</Button>
        <Button onClick={() => frontendConfig.onChangeFontSize(18)}>18</Button>
      </MenuItem>
    ),
  ].filter((item) => item)

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
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open sidebar filter drawer"
                    onClick={onToggleDesktopFilterViewOpen}
                    edge="start"
                    sx={{display: {xs: "none", md: "inline-flex"}}}
                  >
                    <FilterListIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    aria-label="open fullscreen filter drawer"
                    onClick={onToggleMobileFilterViewOpen}
                    edge="start"
                    sx={{display: {xs: "inline-flex", md: "none"}}}
                  >
                    <FilterListIcon fontSize="large" />
                  </IconButton>
                </>
              }
            />
            <Route
              path="/*"
              element={
                <IconButton
                  color="inherit"
                  aria-label="back to previous page"
                  onClick={() => navigate(-1)}
                  edge="start"
                >
                  <ArrowBack fontSize="large" />
                </IconButton>
              }
            />
          </Routes>
          <Link href={frontendConfig.PUBLIC_URL} sx={{p: 1}}>
            <Box
              className={"sidre-header-logo-mobile"}
              component="img"
              sx={{
                display: {xs: "block", sm: "none"},
                height: 50,
                width: 50,
              }}
              alt="SIDRE logo mobile"
              src={getLogoUrl(isDarkMode, true)}
            />
            <Box
              className={"sidre-header-logo"}
              component="img"
              sx={{
                display: {xs: "none", sm: "block"},
                height: 50,
                width: 50,
              }}
              alt="SIDRE logo"
              src={getLogoUrl(isDarkMode, false)}
            />
          </Link>
          <Button
            className="sidre-header-title"
            aria-label="SIDRE-TITLE"
            href={frontendConfig.PUBLIC_URL}
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
          <Box sx={{display: {xs: "none", sm: "block"}}}>
            {externalInfoUrl && (
              <Button
                size="large"
                aria-label={"to info pages"}
                href={externalInfoUrl}
                color="inherit"
              >
                {t("HEADER.INFO")}
              </Button>
            )}
            <MenuButton
              title="language"
              text={currentSupportedLanguage}
              menuItems={languageMenuItems}
            />
            {settingsMenuItems.length > 0 && (
              <MenuButton
                title="settings"
                icon={<Tune />}
                menuItems={settingsMenuItems}
              />
            )}
          </Box>
          <Box sx={{display: {xs: "block", sm: "none"}}}>
            <MenuButton
              title="all-menu-items"
              icon={<MoreVert />}
              menuItems={[
                externalInfoUrl && (
                  <MenuItem key="info" component="a" href={externalInfoUrl}>
                    {t("HEADER.INFO")}
                  </MenuItem>
                ),
                <NestedMenuItem key="lng" title={t("LABEL.LANGUAGE")}>
                  {languageMenuItems}
                </NestedMenuItem>,
                <Divider key="settings-divider" sx={{marginY: 0.5}} />,
                settingsMenuItems.length > 0 && (
                  <NestedMenuItem key="settings" title={t("LABEL.SETTINGS")}>
                    {settingsMenuItems}
                  </NestedMenuItem>
                ),
              ]}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
