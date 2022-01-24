import React from "react"
import {Route, Switch, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, useMediaQuery, useTheme} from "@mui/material"

import "./App.css"
import {OersiConfigContext} from "./helpers/use-context"
import CookieNotice from "./components/CookieNotice"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ScrollTop from "./components/ScrollTop"
import Contact from "./views/Contact"
import ResourceDetails from "./views/ResourceDetails"
import Search from "./views/Search"

const CompressedContent = (props) => {
  const theme = useTheme()
  const {compress, width} = props
  return (
    <Box
      sx={{
        flexGrow: 1,
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        ...(compress && {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: `${width}px`,
        }),
      }}
    >
      {props.children}
    </Box>
  )
}

const App = (props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {noSsr: true})
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
  const [isFilterViewOpen, setFilterViewOpen] = React.useState(!isMobile)
  const location = useLocation()
  const searchViewPath = "/"
  const isFilterViewAvailable = location.pathname === searchViewPath

  return (
    <>
      <Helmet>
        <title>{t("META.TITLE")}</title>
        <meta name="description" content={t("META.DESCRIPTION")} />
        <link rel="canonical" href={oersiConfig.PUBLIC_URL} />
      </Helmet>
      <Header onToggleFilterView={() => setFilterViewOpen(!isFilterViewOpen)} />
      {oersiConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <CompressedContent
        compress={isFilterViewOpen && isFilterViewAvailable && !isMobile}
        width={oersiConfig.filterSidebarWidth}
      >
        <Switch>
          <Route exact path={searchViewPath}>
            <Search
              isMobile={isMobile}
              isFilterViewOpen={isFilterViewOpen}
              onCloseFilterView={() => setFilterViewOpen(false)}
            />
          </Route>
          <Route exact path="/services/contact" component={Contact} />
          <Route
            exact
            path="(/details)?/:resourceId([A-Za-z0-9-_=]{12,})"
            component={ResourceDetails}
          />
        </Switch>
        <Footer />
      </CompressedContent>
      <CookieNotice />
    </>
  )
}

export default App
