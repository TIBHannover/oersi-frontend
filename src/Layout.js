import React from "react"
import Header from "./components/Header"
import SearchIndexFrontendConfigContext from "./helpers/SearchIndexFrontendConfigContext"
import {Box, useTheme} from "@mui/material"
import {useRouter} from "next/router"
import Footer from "./components/Footer"
import ScrollTop from "./components/ScrollTop"
import CookieNotice from "./components/CookieNotice"

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

const Layout = (props) => {
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const router = useRouter()
  const {pathname} = router
  const isFilterViewAvailable = pathname === "/"

  return (
    <div className="container">
      <Header />
      {frontendConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <CompressedContent
        compress={frontendConfig.isDesktopFilterViewOpen && isFilterViewAvailable}
        width={frontendConfig.filterSidebarWidth}
      >
        {props.children}
        <Footer />
      </CompressedContent>
      <CookieNotice />
    </div>
  )
}

export default Layout
