import React, {useState} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
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
          label={onItemRender(
            props.data[index].key,
            props.data[index].doc_count,
            props.component,
            props.t
          )}
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
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const [isExpanded, setExpanded] = useState(false)
  const onChangeExpanded = (event, expanded) => {
    setExpanded(expanded)
  }
  return (
    <Accordion onChange={onChangeExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="div">
          <div className="filter-heading">
            {t("LABEL." + props.title.toUpperCase())}
          </div>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="multilist full-width">
          <MultiList
            className={props.className}
            dataField={props.dataField}
            componentId={props.component}
            showMissing={props.showMissing}
            missingLabel={"N/A"}
            placeholder={t("LABEL." + props.placeholder.toUpperCase())}
            showFilter={props.showFilter}
            showSearch={props.showSearch}
            size={props.size}
            filterLabel={props.filterLabel.toUpperCase()}
            URLParams={props.URLParams}
            react={{and: props.and}}
            innerClass={{
              input: "search-component-input",
            }}
            customQuery={props.customQuery}
            defaultQuery={props.defaultQuery}
          >
            {({loading, error, data, value, handleChange}) =>
              isExpanded && (
                <MultiSelectionItems
                  component={props.component}
                  data={data}
                  value={value}
                  onSelectionChange={handleChange}
                  t={t}
                />
              )
            }
          </MultiList>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
export function onItemRender(label, count, component, t) {
  const text = getLabelForStandardComponent(label, component, t)
  return (
    <>
      <div className="filter-item-label-text" title={text}>
        {text}
      </div>
      {/* TODO: badge is bootstrap and should be replaced by a mui-component */}
      <Box className="badge badge-info" sx={{ml: "auto"}}>
        {count}
      </Box>
    </>
  )
}

export default MultiSelectionFilter
export {MultiSelectionItems, MultiSelectionFilter}
