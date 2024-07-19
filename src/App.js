import React from "react"
import {Route, Routes, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, useTheme} from "@mui/material"

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
  const defaultTransition = theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
  const compressTransition = theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  })
  return (
    <Box
      sx={{
        flexGrow: 1,
        transition: {
          xs: defaultTransition,
          md: compress ? compressTransition : defaultTransition,
        },
        marginLeft: {xs: 0, md: compress ? `${width}px` : 0},
      }}
    >
      {props.children}
    </Box>
  )
}

const App = (props) => {
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
  const location = useLocation()
  const isSearchView = location.pathname === "/"
  const isFilterViewAvailable = isSearchView

  return (
    <>
      <Helmet>
        <title>{t("META.TITLE")}</title>
        <meta name="description" content={t("META.DESCRIPTION")} />
        <link rel="canonical" href={oersiConfig.PUBLIC_URL} />
        <meta property="og:title" content={t("META.TITLE")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={oersiConfig.PUBLIC_URL} />
        <meta property="og:site_name" content={t("HEADER.TITLE")} />
        <meta property="og:description" content={t("META.DESCRIPTION")} />
        {oersiConfig.DEFAULT_SOCIAL_MEDIA_IMAGE && (
          <meta
            property="og:image"
            content={oersiConfig.DEFAULT_SOCIAL_MEDIA_IMAGE}
          />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      {oersiConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <CompressedContent
        compress={oersiConfig.isDesktopFilterViewOpen && isFilterViewAvailable}
        width={oersiConfig.filterSidebarWidth}
      >
        <Box sx={isSearchView ? {} : {display: "none"}}>
          {/* use hidden search instead of separate Router-Route, because otherwise the search-field crashes on non-search-views */}
          <Search />
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
