import React from "react"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "../multiListComponent/MultiListComponent"

const FiltersComponent = (props) => {
  return (
    <>
      <div className={props.className}>
        {props.type === "dropdown"
          ? props.multilist.map((list, index) => (
              <MultiDropDownComponent
                isMobile={props.isMobile}
                key={index}
                {...list}
              />
            ))
          : props.multilist.map((list, index) => (
              <MultiListComponent key={index} {...list} />
            ))}
      </div>
    </>
  )
}

export default FiltersComponent
