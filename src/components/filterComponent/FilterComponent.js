import React from "react"
import "./filterComponent.css"
import CustomComponent from "../customComponent/CustomComponent"
import {SelectedFilters} from "@appbaseio/reactivesearch"
import ResultComponent from "../resultComponent/ResultComponent"
import HeaderComponent from "../headerComponent/HeaderComponent"

/**
 * This is the Filter component,this component is to show the filters,for diferrent view
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const FilterComponent = (props) => {
  return (
    <>
      <HeaderComponent isMobile={props.isMobile}>
        {props.isMobile &&
          props.multilist.map((list, index) => (
            <CustomComponent isMobile={props.isMobile} key={index} {...list} />
          ))}
      </HeaderComponent>
      <div className="sub-container">
        {props.isMobile ? (
          ""
        ) : (
          <div className={"left-bar"}>
            {props.multilist.slice(0, 3).map((list, index) => (
              <CustomComponent isMobile={props.isMobile} key={index} {...list} />
            ))}
          </div>
        )}
        <div className={"result-container"}>
          <SelectedFilters showClearAll={true} clearAllLabel="Clear filters" />
          <ResultComponent />
        </div>
        {props.isMobile ? (
          ""
        ) : (
          <div className={"right-bar"}>
            {props.multilist
              .slice(3, props.multilist.length + 1)
              .map((list, index) => (
                <CustomComponent isMobile={props.isMobile} key={index} {...list} />
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default FilterComponent
