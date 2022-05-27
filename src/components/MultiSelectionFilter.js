import React, {useEffect, useState} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import {useTranslation} from "next-i18next"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {FixedSizeList} from "react-window"

import {getLabelForStandardComponent} from "../helpers/helpers"
import OersiConfigContext from "../helpers/OersiConfigContext"

const MultiSelectionItems = (props) => {
  const itemCount = props.data ? props.data.length : 0
  const itemSize = 30
  const listHeight = Math.min(240, itemCount * itemSize)
  return (
    <FixedSizeList
      height={listHeight}
      itemCount={itemCount}
      itemSize={itemSize}
      width={"100%"}
    >
      {({index, style}) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.data[index].key in props.value}
              onChange={props.onSelectionChange}
              value={props.data[index].key}
              style={{height: itemSize + "px"}}
            />
          }
          label={onItemRender(props.data[index].label, props.data[index].doc_count)}
          className={"full-width"}
          sx={{mr: 0, mb: 0}}
          style={delete style.width && style}
          classes={{label: "filter-item-label full-width"}}
        />
      )}
    </FixedSizeList>
  )
}

const MultiSelectionFilter = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const {dataField, size, allowedSearchRegex} = props
  const reloadAggregationsOnSearch =
    oersiConfig.AGGREGATION_SEARCH_COMPONENTS?.includes(props.componentId)
  const aggregationSearchDebounce = oersiConfig.AGGREGATION_SEARCH_DEBOUNCE
  const aggregationSearchMinLength = oersiConfig.AGGREGATION_SEARCH_MIN_LENGTH
  const [isExpanded, setExpanded] = useState(false)
  const onChangeExpanded = (event, expanded) => {
    setExpanded(expanded)
  }
  const [values, setValues] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const onUpdateSearchTerm = (term) => {
    if (allowedSearchRegex && !term.match(allowedSearchRegex)) {
      return
    }
    setSearchTerm(term)
  }
  const [defaultQuery, setDefaultQuery] = useState(
    props.defaultQuery ? props.defaultQuery() : null
  )

  useEffect(() => {
    const updateAggsSearchQuery = (term) => {
      if (!term || term.length < aggregationSearchMinLength) {
        setDefaultQuery(null)
        return
      }
      const script =
        "if (doc['" +
        dataField +
        "'].size()==0) {return null} else if (doc['" +
        dataField +
        "'].value.toLowerCase(Locale.ROOT).contains('" +
        term.toLowerCase() +
        "')) {return doc['" +
        dataField +
        "'].value} else {return null}"
      const query = {
        aggs: {
          [dataField]: {
            terms: {
              script: {source: script},
              size: size,
              order: {_count: "desc"},
            },
          },
        },
      }
      setDefaultQuery(query)
    }

    if (!reloadAggregationsOnSearch) {
      return
    }
    const timer = setTimeout(
      () => updateAggsSearchQuery(searchTerm),
      aggregationSearchDebounce
    )
    return () => clearTimeout(timer)
  }, [
    searchTerm,
    aggregationSearchDebounce,
    aggregationSearchMinLength,
    dataField,
    reloadAggregationsOnSearch,
    size,
  ])

  return (
    <Accordion onChange={onChangeExpanded} square disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="div">
          <div className="filter-heading">
            {t("LABEL." + props.title.toUpperCase())}
          </div>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="multilist full-width">
          {props.showSearch && (
            <TextField
              inputProps={{
                "aria-label": "search " + props.componentId,
                sx: {boxSizing: "content-box !important"},
              }}
              size="small"
              placeholder={t("LABEL." + props.placeholder.toUpperCase())}
              value={searchTerm}
              sx={{width: "100%", marginBottom: theme.spacing(1)}}
              InputProps={{sx: {borderRadius: "1em"}}}
              onChange={(event) => onUpdateSearchTerm(event.target.value)}
            />
          )}
          <MultiList
            {...props}
            title={null}
            showSearch={false}
            value={values}
            onChange={setValues}
          >
            {({loading, error, data, value, handleChange}) => {
              const labelledData = data.map((d) => {
                return {
                  ...d,
                  label: getLabelForStandardComponent(d.key, props.componentId, t),
                }
              })
              return (
                isExpanded && (
                  <MultiSelectionItems
                    component={props.componentId}
                    data={labelledData?.filter((d) =>
                      d.label?.match(new RegExp(".*" + searchTerm + ".*", "i"))
                    )}
                    value={value}
                    onSelectionChange={handleChange}
                    t={t}
                  />
                )
              )
            }}
          </MultiList>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
function onItemRender(label, count) {
  return (
    <>
      <div className="filter-item-label-text" title={label}>
        {label}
      </div>
      <Chip
        className="filter-item-counter-badge"
        label={count}
        color="primary"
        size="small"
        sx={{ml: "auto"}}
      />
    </>
  )
}

export default MultiSelectionFilter
