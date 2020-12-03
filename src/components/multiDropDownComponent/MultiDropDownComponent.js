import React from "react"
import "./multiDropDownComponent.css"
import {MultiDropdownList} from "@appbaseio/reactivesearch"
import {getLabelForStandardComponent} from "../../helpers/helpers"
import {withTranslation} from "react-i18next"

const MultiDropDownComponent = (props) => {
  return (
    <MultiDropdownList
      className={
        props.className +
        " multilist-drop-down-" +
        (props.isMobile ? "show" : "hide")
      }
      dataField={props.dataField}
      // title={props.title}
      componentId={props.component}
      showMissing={props.showMissing}
      missingLabel={props.t("FILTER." + props.missingLabel)}
      placeholder={props.t("CARD." + props.placeholder.toUpperCase())}
      showFilter={props.showFilter}
      showSearch={false}
      size={props.size}
      filterLabel={props.t("CARD." + props.filterLabel.toUpperCase())}
      URLParams={props.URLParams}
      react={{
        and: props.and,
      }}
      renderItem={(label, count) => onItemRender(label, count, props.component)}
      innerClass={{
        label: "multilist-label",
        input: "search-input",
      }}
      customQuery={props.customQuery}
      defaultQuery={props.defaultQuery}
    />
  )

  function onItemRender(label, count, component) {
    return (
      <div className="col-12 multilist-col">
        <div className="row">
          <div className="col-10">
            <span className="multilist-span">
              {getLabelForStandardComponent(label, component, props.t)}{" "}
            </span>
          </div>
          <div className="col-2">
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
])(MultiDropDownComponent)
