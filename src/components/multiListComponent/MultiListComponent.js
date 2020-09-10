import React from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
import {withTranslation} from "react-i18next"
import ISO6391 from "iso-639-1"

const MultiListComponent = (props) => {
  return (
    <div className="multilist card">
      <div className="multilist content">
        <div className="filter-heading center">
          <b>
            {" "}
            <i className={props.fontAwesome} /> {props.title}
          </b>
        </div>
        <hr className="blue" />
        <MultiList
          className={props.className}
          dataField={props.dataField}
          // title={props.title}
          componentId={props.component}
          // queryFormat="or"
          showMissing={props.showMissing}
          missingLabel={props.missingLabel}
          placeholder={props.placeholder}
          showFilter={props.showFilter}
          showSearch={props.showSearch}
          filterLabel={props.filterLabel}
          URLParams={props.URLParams}
          react={{and: props.and}}
          renderItem={(label, count) =>
            onLicenceRender(label, count, props.component)
          }
          innerClass={{
            label: "multilist-label",
            input: "search-input",
            checkbox: "multilist-checkbox",
          }}
        />
      </div>
    </div>
  )
  function onLicenceRender(label, count, component) {
    if (component === "license") {
      return (
        <div className="col-11 multilist-col">
          <div className="row">
            <div className="col-9">
              <span className="multilist-span">
                {label.split("/").slice(-2)[0].toUpperCase()}{" "}
              </span>
            </div>
            <div className="col-2">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="col-9 multilist-col">
          <div className="row">
            <div className="col-9">
              <span className="multilist-span">
                {getLabelForStandardComponent(label, component)}{" "}
              </span>
            </div>
            <div className="col-3">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    }
  }
  function getLabelForStandardComponent(label, component) {
    if (component === "language") {
      /* languages.getName("de", "en")) */
      return label.inLanguage !== null &&
        ISO6391.getName(label.toString().toLowerCase(), "en") !== ""
        ? ISO6391.getName(label.toString().toLowerCase(), "en")
        : label
    } else if (component === "provider") {
      return props.t("provider:" + label, {keySeparator: false})
    } else if (component === "learningResourceType") {
      return props.t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
    } else if (component === "about") {
      return props.t("subject#" + label, {keySeparator: false, nsSeparator: "#"})
    } else {
      return label
    }
  }
}

export default withTranslation(["translation", "provider", "lrt", "subject"])(
  MultiListComponent
)
