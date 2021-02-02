import React from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
import {getLabelForStandardComponent} from "../../helpers/helpers"
import {withTranslation} from "react-i18next"
import Button from "@material-ui/core/Button"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import Collapse from "@material-ui/core/Collapse"

const MultiListComponent = (props) => {
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <div className="multilist card">
      <div className="multilist content pl-3 pr-3">
        <Button
          fullWidth={true}
          style={{justifyContent: "flex-start"}}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show filter values"
        >
          <div className="filter-heading">
            {props.t("CARD." + props.title.toUpperCase())}
          </div>
          {expanded ? (
            <ExpandLessIcon className="filter-heading-icon" />
          ) : (
            <ExpandMoreIcon className="filter-heading-icon" />
          )}
        </Button>
        <Collapse in={expanded} timeout="auto">
          <MultiList
            className={props.className}
            dataField={props.dataField}
            // title={props.title}
            componentId={props.component}
            // queryFormat="or"
            showMissing={props.showMissing}
            missingLabel={props.t("FILTER." + props.missingLabel)}
            placeholder={props.t("CARD." + props.placeholder.toUpperCase())}
            showFilter={props.showFilter}
            showSearch={props.showSearch}
            size={props.size}
            filterLabel={props.t("CARD." + props.filterLabel.toUpperCase())}
            URLParams={props.URLParams}
            react={{and: props.and}}
            renderItem={(label, count) =>
              onItemRender(label, count, props.component)
            }
            innerClass={{
              label: "multilist-label",
              input: "search-input",
              checkbox: "multilist-checkbox",
            }}
            customQuery={props.customQuery}
            defaultQuery={props.defaultQuery}
          />
        </Collapse>
      </div>
    </div>
  )
  function onItemRender(label, count, component) {
    return (
      <div className="col-12 multilist-col">
        <div className="row">
          <div className="col-xl-10 col-lg-9 col-md-9 col-sm-9">
            <span className="multilist-span">
              {getLabelForStandardComponent(label, component, props.t)}{" "}
            </span>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-2 col-sm-1">
            <span className="badge badge-info">{count}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation([
  "translation",
  "provider",
  "language",
  "lrt",
  "subject",
])(MultiListComponent)
