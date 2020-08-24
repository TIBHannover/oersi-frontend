import React from "react"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "../multiListComponent/MultiListComponent"
const CustomComponent = (props) => {
  const onLicenceRender = (isMobile) => {
    if (isMobile) return <MultiDropDownComponent {...props} />
    else return <MultiListComponent {...props} />
  }

  return onLicenceRender(props.isMobile)
}

export default CustomComponent
