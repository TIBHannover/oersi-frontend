import React from "react"
import Header from "./components/Header"
import OersiConfigContext from "./helpers/OersiConfigContext"
import {Box, useTheme} from "@mui/material"
import {useRouter} from "next/router"
import Footer from "./components/Footer"
import ScrollTop from "./components/ScrollTop"

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

const Layout = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const router = useRouter()
  const {pathname} = router
  const isFilterViewAvailable = pathname === "/"

  return (
    <div className="container">
      <Header
        onToggleFilterView={() =>
          oersiConfig.setFilterViewOpen(!oersiConfig.isFilterViewOpen)
        }
      />
      {oersiConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <CompressedContent
        compress={
          oersiConfig.isFilterViewOpen &&
          isFilterViewAvailable &&
          !oersiConfig.isMobile
        }
        width={oersiConfig.filterSidebarWidth}
      >
        {props.children}
        {/*  TODO: footer etc */}
        <Footer />
      </CompressedContent>
    </div>
  )
}

export default Layout
