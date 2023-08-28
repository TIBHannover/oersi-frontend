import React, {useState} from "react"
import {useTranslation} from "next-i18next"
import {Box, Button, Divider, Drawer, useTheme} from "@mui/material"

import MultiSelectionFilter from "./MultiSelectionFilter"
import OersiConfigContext from "../helpers/OersiConfigContext"
import ResultStats from "./ResultStats"
import SwitchFilter from "./SwitchFilter"

const SideBarHeader = (props) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        // placeholder to fill appbar content
        // height of the app bar is determined by the image-height (50px) plus 1-theme-padding on top and bottom
        minHeight: `calc(50px + ${theme.spacing(2)})`,
        marginBottom: theme.spacing(1),
      }}
    />
  )
}

const FullScreenHeader = (props) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const {onClose} = props

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(1),
        justifyContent: "flex-end",
        // fill appbar content
        marginTop: `calc(50px + ${theme.spacing(2)})`,
      }}
    >
      <ResultStats sx={{padding: theme.spacing(1)}} />
      <Button variant="contained" onClick={onClose}>
        {t("FILTER.SHOW_RESULTS")}
      </Button>
    </Box>
  )
}

const Filters = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const [multiList] = useState(oersiConfig.searchConfiguration.multiList)
  const [switchList] = useState(oersiConfig.searchConfiguration.switchList)
  const {
    onCloseDesktopFilterView,
    isDesktopFilterViewOpen,
    isMobileFilterViewOpen,
    onCloseMobileFilterView,
  } = oersiConfig
  const sidebarWidth = oersiConfig.filterSidebarWidth
  const enabledFilters = oersiConfig.ENABLED_FILTERS
    ? oersiConfig.ENABLED_FILTERS
    : []

  const filters = (
    <>
      {multiList
        .filter((item) => enabledFilters.includes(item.componentId))
        .map((item, index) => (
          <MultiSelectionFilter key={item.componentId} {...item} />
        ))}
      {switchList
        .filter((item) => enabledFilters.includes(item.componentId))
        .map((item, index) => (
          <SwitchFilter key={item.componentId} {...item} />
        ))}
    </>
  )

  return (
    <>
      <Drawer
        sx={{
          display: {xs: "block", md: "none"},
          width: "100%",
          "& .MuiDrawer-paper": {
            minHeight: "100%",
          },
        }}
        variant="persistent"
        anchor={"top"}
        open={isMobileFilterViewOpen}
        onClose={onCloseMobileFilterView}
      >
        <FullScreenHeader onClose={onCloseMobileFilterView} />
        <Divider />
        {filters}
      </Drawer>
      <Drawer
        sx={{
          display: {xs: "none", md: "block"},
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor={"left"}
        open={isDesktopFilterViewOpen}
        onClose={onCloseDesktopFilterView}
      >
        <SideBarHeader />
        <Divider />
        {filters}
      </Drawer>
    </>
  )
}

export default Filters
