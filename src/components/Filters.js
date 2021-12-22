import React from "react"
import MultiSelectionFilter from "./MultiSelectionFilter"

const Filters = (props) => {
  return (
    <div className={props.className}>
      {props.multilist.map((list, index) => (
        <MultiSelectionFilter key={props.identifier + list.component} {...list} />
      ))}
    </div>
  )
}

export default Filters
