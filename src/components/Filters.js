import React from "react"
import MultiSelectionList from "./MultiSelectionList"

const Filters = (props) => {
  return (
    <div className={props.className}>
      {props.multilist.map((list, index) => (
        <MultiSelectionList key={props.identifier + list.component} {...list} />
      ))}
    </div>
  )
}

export default Filters
