import React from "react"
import "./customComponent.css"
import MultiListComponent from "../multiListComponent/MultiListComponent"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
/**
 * CustomComponent
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const CustomComponent = (props) => {
  let renderContent = (isMobile) => {
    if (isMobile) {
      return <MultiDropDownComponent {...props} />
    }
    return <MultiListComponent {...props} />
  }

  return renderContent(props.isMobile)
}

export default CustomComponent
