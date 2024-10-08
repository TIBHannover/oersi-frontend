import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {Box, Button, Divider, Drawer, useTheme} from "@mui/material"

import MultiSelectionFilter from "./MultiSelectionFilter"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import ResultStats from "./ResultStats"
import SwitchFilter from "./SwitchFilter"
import DateRangeFilter from "./DateRangeFilter"

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
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const [filtersConfig] = useState(frontendConfig.searchConfiguration.filters)
  const {
    onCloseDesktopFilterView,
    isDesktopFilterViewOpen,
    isMobileFilterViewOpen,
    onCloseMobileFilterView,
  } = frontendConfig
  const sidebarWidth = frontendConfig.filterSidebarWidth

  const filters = (
    <>
      {filtersConfig.map((item) => {
        if (item.type === "switch") {
          return <SwitchFilter key={item.componentId} {...item} />
        } else if (item.type === "daterange") {
          return <DateRangeFilter key={item.componentId} {...item} />
        }
        return <MultiSelectionFilter key={item.componentId} {...item} />
      })}
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
