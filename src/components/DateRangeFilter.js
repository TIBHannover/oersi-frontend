import React from "react"
import {DynamicRangeSlider} from "@appbaseio/reactivesearch"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {useTranslation} from "react-i18next"

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
          <DynamicRangeSlider
            dataField={dataField}
            componentId={props.componentId}
            filterLabel={labelKey}
            calendarInterval={"month"}
            tooltipTrigger={"hover"}
            // stepValue={1000 * 60 * 60 * 24}
            queryFormat={"epoch_millis"}
            showHistogram={true}
            URLParams={true}
            rangeLabels={(min, max) => {
              return {
                start: toDateString(min, i18n.resolvedLanguage),
                end: toDateString(max, i18n.resolvedLanguage),
              }
            }}
            renderTooltipData={(data) => (
              <Typography
                variant="h6"
                component="div"
                sx={{
                  textDecoration: "underline",
                }}
              >
                {toDateString(data, i18n.resolvedLanguage)}
              </Typography>
            )}
          ></DynamicRangeSlider>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default DateRangeFilter
