import React from "react"
import "./multiDropDownComponent.css"
import { MultiList } from "@appbaseio/reactivesearch"
import { withTranslation } from "react-i18next"
import CheckboxList from "./CheckboxList";


const MultiDropDownComponent = (props) => {  
  return (
      <MultiList
        className={props.className}
        dataField={props.dataField}
        // title={props.title}
        componentId={props.component}
        placeholder={props.placeholder}
        showFilter={props.showFilter}
        showSearch={false}
        filterLabel={props.filterLabel}
        URLParams={props.URLParams}
        react={{
          and: props.and,
        }}
        render={({ data, handleChange }) => <CheckboxList data={data} onChange={handleChange} title={props.title} />}
        innerClass={{
          label: "multilist-label",
          input: "search-input",
        }}
      />
  )
}

export default withTranslation()(MultiDropDownComponent)
