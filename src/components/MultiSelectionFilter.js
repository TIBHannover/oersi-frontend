import React, {useState} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
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

import "./MultiSelectionFilter.css"
import {getLabelForStandardComponent} from "../helpers/helpers"

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
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const [isExpanded, setExpanded] = useState(false)
  const onChangeExpanded = (event, expanded) => {
    setExpanded(expanded)
  }
  const [searchTerm, setSearchTerm] = useState("")

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
              inputProps={{"aria-label": "search " + props.component}}
              size="small"
              placeholder={t("LABEL." + props.placeholder.toUpperCase())}
              value={searchTerm}
              sx={{width: "100%", marginBottom: theme.spacing(1)}}
              InputProps={{sx: {borderRadius: "1em"}}}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}
          <MultiList
            className={props.className}
            dataField={props.dataField}
            componentId={props.component}
            showMissing={props.showMissing}
            missingLabel={"N/A"}
            showFilter={props.showFilter}
            showSearch={false} // use custom search-field instead (see above)
            size={props.size}
            filterLabel={props.filterLabel.toUpperCase()}
            URLParams={props.URLParams}
            react={{and: props.and}}
            customQuery={props.customQuery}
            defaultQuery={props.defaultQuery}
          >
            {({loading, error, data, value, handleChange}) => {
              const labelledData = data.map((d) => {
                return {
                  ...d,
                  label: getLabelForStandardComponent(d.key, props.component, t),
                }
              })
              return (
                isExpanded && (
                  <MultiSelectionItems
                    component={props.component}
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
