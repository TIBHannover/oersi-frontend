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
          placeholder={props.placeholder}
          showFilter={props.showFilter}
          showSearch={props.showSearch}
          filterLabel={props.filterLabel}
          URLParams={props.URLParams}
          react={{or: props.and}}
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
    } else if (component === "language") {
      return (
        <div className="col-9 multilist-col">
          <div className="row">
            <div className="col-9">
              <span className="multilist-span">
                {/* languages.getName("de", "en")) */}
                {label.inLanguage !== null &&
                ISO6391.getName(label.toString().toLowerCase(), "en") !== ""
                  ? ISO6391.getName(label.toString().toLowerCase(), "en")
                  : label}{" "}
              </span>
            </div>
            <div className="col-3">
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
              <span className="multilist-span">{label} </span>
            </div>
            <div className="col-3">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default withTranslation()(MultiListComponent)
