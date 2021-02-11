import React from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
import {getLabelForStandardComponent} from "../../helpers/helpers"
import {withTranslation} from "react-i18next"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"

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
        <div className="multilist">
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
            renderItem={(label, count) =>
              onItemRender(label, count, props.component)
            }
            innerClass={{
              label: "multilist-label",
              input: "search-component-input",
              checkbox: "multilist-checkbox",
            }}
            customQuery={props.customQuery}
            defaultQuery={props.defaultQuery}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  )
  function onItemRender(label, count, component) {
    return (
      <Typography variant="body1" component="span" className="multilist-item">
        <div>{getLabelForStandardComponent(label, component, props.t)}</div>
        <div className="badge badge-info ml-auto">{count}</div>
      </Typography>
    )
  }
}

export default withTranslation(["translation", "language", "lrt", "subject"])(
  MultiListComponent
)
export {MultiListComponent}
