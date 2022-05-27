import {useTranslation} from "next-i18next"
import {CircularProgress, Fade, Typography} from "@mui/material"
import React from "react"
import {StateProvider} from "@appbaseio/reactivesearch"

const ResultStats = (props) => {
  const {t} = useTranslation()
  return (
    <StateProvider
      componentIds="results"
      includeKeys={["hits", "isLoading"]}
      strict={false}
      render={({searchState}) => (
        <Typography
          aria-label="total-result"
          component="div"
          variant="h6"
          sx={{fontWeight: "normal", ...props.sx}}
          color="textPrimary"
        >
          {searchState.results?.isLoading
            ? ""
            : t("RESULT_LIST.SHOW_RESULT_STATS", {
                total: searchState.results?.hits?.total,
              })}{" "}
          <Fade in={searchState.results?.isLoading} mountOnEnter unmountOnExit>
            <CircularProgress
              aria-label="loading-progress"
              color="inherit"
              size={16}
            />
          </Fade>
        </Typography>
      )}
    />
  )
}
export default ResultStats
