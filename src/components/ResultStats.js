import {useTranslation} from "next-i18next"
import {CircularProgress, Fade, Typography} from "@mui/material"
import React from "react"
import {useInstantSearch, useStats} from "react-instantsearch"

const ResultStats = (props) => {
  const {t} = useTranslation()
  const {status} = useInstantSearch()
  const {nbHits} = useStats()
  const isLoading = status === "loading" || status === "stalled"
  return (
    <Typography
      aria-label="total-result"
      component="div"
      variant="h6"
      sx={{fontWeight: "normal", ...props.sx}}
      color="textPrimary"
    >
      {isLoading
        ? ""
        : t("RESULT_LIST.SHOW_RESULT_STATS", {
            total: nbHits,
          })}{" "}
      <Fade in={isLoading} mountOnEnter unmountOnExit>
        <CircularProgress aria-label="loading-progress" color="inherit" size={16} />
      </Fade>
    </Typography>
  )
}
export default ResultStats
