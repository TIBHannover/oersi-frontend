import React from "react"
import {useScrollTrigger, useTheme} from "@mui/material"
import Fab from "@mui/material/Fab"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Zoom from "@mui/material/Zoom"

const ScrollTop = () => {
  const theme = useTheme()
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = () => {
    const anchor = document.querySelector("#top-anchor")
    anchor.scrollIntoView({behavior: "smooth", block: "center"})
  }

  return (
    <>
      <div id="top-anchor" />
      <Zoom in={trigger}>
        <Fab
          onClick={handleClick}
          size="small"
          aria-label="scroll back to top"
          sx={{
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            position: "fixed",
            zIndex: 1800,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  )
}
export default ScrollTop
