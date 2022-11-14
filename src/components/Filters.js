import React, {useState} from "react"
import config from "react-global-configuration"
import {useTranslation} from "react-i18next"
import {Box, Button, Divider, Drawer, useTheme} from "@mui/material"

import MultiSelectionFilter from "./MultiSelectionFilter"
import {OersiConfigContext} from "../helpers/use-context"
import ResultStats from "./ResultStats"

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
  const [multiList] = useState(config.get("multiList"))
  const {isMobile, onClose, open} = props
  const sidebarWidth = oersiConfig.filterSidebarWidth
  const enabledFilters = oersiConfig.ENABLED_FILTERS
    ? oersiConfig.ENABLED_FILTERS
    : []

  return (
    <Drawer
      sx={
        isMobile
          ? {
              width: "100%",
              "& .MuiDrawer-paper": {
                minHeight: "100%",
              },
            }
          : {
              width: sidebarWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: sidebarWidth,
                boxSizing: "border-box",
              },
            }
      }
      variant="persistent"
      anchor={isMobile ? "top" : "left"}
      open={open}
      onClose={onClose}
    >
      {isMobile ? <FullScreenHeader onClose={onClose} /> : <SideBarHeader />}
      <Divider />
      {multiList
        .filter((item) => enabledFilters.includes(item.componentId))
        .map((item, index) => (
          <MultiSelectionFilter key={item.componentId} {...item} />
        ))}
    </Drawer>
  )
}

export default Filters
