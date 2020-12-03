import React from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
import {getLabelForStandardComponent} from "../../helpers/helpers"
import {withTranslation} from "react-i18next"

const MultiListComponent = (props) => {
  return (
    <div className="multilist card">
      <div className="multilist content">
        <div className="filter-heading center">
          <b>
            {" "}
            <i className={props.fontAwesome} />{" "}
            {props.t("CARD." + props.title.toUpperCase())}
          </b>
        </div>
        {!props.showSearch && <hr className="blue" />}
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
          renderItem={(label, count) => onItemRender(label, count, props.component)}
          innerClass={{
            label: "multilist-label",
            input: "search-input",
            checkbox: "multilist-checkbox",
          }}
          customQuery={props.customQuery}
          defaultQuery={props.defaultQuery}
        />
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
