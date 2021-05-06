import React from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
import {getLabelForStandardComponent} from "../../helpers/helpers"
import {withTranslation} from "react-i18next"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {FixedSizeList} from "react-window"

const MultiListComponent = (props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <div className="filter-heading">
            {props.t("LABEL." + props.title.toUpperCase())}
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
            placeholder={props.t("LABEL." + props.placeholder.toUpperCase())}
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
            {({loading, error, data, value, handleChange}) => {
              const itemCount = data ? data.length : 0
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
                          checked={data[index].key in value}
                          onChange={handleChange}
                          value={data[index].key}
                          style={{height: itemSize + "px"}}
                        />
                      }
                      label={onItemRender(
                        data[index].key,
                        data[index].doc_count,
                        props.component,
                        props.t
                      )}
                      className={"mr-0 mb-0 full-width"}
                      style={delete style.width && style}
                      classes={{label: "filter-item-label full-width"}}
                    />
                  )}
                </FixedSizeList>
              )
            }}
          </MultiList>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
export function onItemRender(label, count, component, t) {
  return (
    <>
      <div>{getLabelForStandardComponent(label, component, t)}</div>
      <div className="badge badge-info ml-auto">{count}</div>
    </>
  )
}

export default withTranslation(["translation", "language", "lrt", "subject"])(
  MultiListComponent
)
export {MultiListComponent}
