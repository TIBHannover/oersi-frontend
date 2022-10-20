import React from "react"
import {Route, Routes, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, useMediaQuery, useTheme} from "@mui/material"

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
  const isSearchView = location.pathname === "/"
  const isFilterViewAvailable = isSearchView

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
        <Box sx={isSearchView ? {} : {display: "none"}}>
          {/* use hidden search instead of separate Router-Route, because otherwise the search-field crashes on non-search-views */}
          <Search
            isMobile={isMobile}
            isFilterViewOpen={isFilterViewOpen}
            onCloseFilterView={() => setFilterViewOpen(false)}
          />
        </Box>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/services/contact" element={<Contact />} />
          <Route path="/details/:resourceId" element={<ResourceDetails />} />
          <Route path="/:resourceId" element={<ResourceDetails />} />
        </Routes>
        <Footer />
      </CompressedContent>
      <CookieNotice />
    </>
  )
}

export default App
