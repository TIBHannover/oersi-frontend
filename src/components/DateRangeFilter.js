import React from "react"
import {RangeInput} from "react-instantsearch"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {useTranslation} from "next-i18next"

function toDateString(value, language) {
  let date = new Date(value)
  return new Intl.DateTimeFormat(language, {dateStyle: "short"}).format(date)
}

// NOTE: under development, first draft/impression
// => reactivesearch component seems to have bugs (cannot select first value) and is hard to customize
const DateRangeFilter = (props) => {
  const theme = useTheme()
  const {t, i18n} = useTranslation([
    "translation",
    "language",
    "labelledConcept",
    "data",
  ])
  const {dataField} = props
  const labelKey = props.labelKey ? props.labelKey : dataField

  return (
    <Accordion square disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="div">
          <Box
            className="filter-heading"
            sx={{fontWeight: theme.typography.fontWeightBold}}
          >
            {t("data:fieldLabels." + labelKey)}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="multilist full-width">
          <RangeInput attribute={props.componentId} />
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default DateRangeFilter
