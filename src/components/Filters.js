import React from "react"
import MultiSelectionFilter from "./MultiSelectionFilter"

const Filters = (props) => {
  return (
    <>
      {props.multilist.map((list, index) => (
        <MultiSelectionFilter key={props.identifier + list.component} {...list} />
      ))}
    </>
  )
}

export default Filters
