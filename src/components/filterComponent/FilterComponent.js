import React from "react"
import "./filterComponent.css"
import {SelectedFilters} from "@appbaseio/reactivesearch"
import ResultComponent from "../resultComponent/ResultComponent"
import HeaderComponent from "../headerComponent/HeaderComponent"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "../multiListComponent/MultiListComponent"
import {withTranslation} from "react-i18next"

/**
 * This is the Filter component,this component is to show the filters,for diferrent view
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const FilterComponent = (props) => {
  return (
    <>
      <HeaderComponent isMobile={props.isMobile}>
        {props.multilist.map((list, index) => (
          <MultiDropDownComponent isMobile={props.isMobile} key={index} {...list} />
        ))}
      </HeaderComponent>
      <div className="sub-container">
        {
          <div className={"left-bar left-bar-" + (props.isMobile ? "hide" : "show")}>
            {props.multilist.slice(0, 3).map((list, index) => (
              <MultiListComponent isMobile={props.isMobile} key={index} {...list} />
            ))}
          </div>
        }
        <div className={"result-container"}>
          <SelectedFilters
            showClearAll={true}
            clearAllLabel={props.t("FILTER.CLEAR_ALL")}
          />
          <ResultComponent />
        </div>
        {
          <div
            className={"right-bar right-bar-" + (props.isMobile ? "hide" : "show")}
          >
            {props.multilist
              .slice(3, props.multilist.length + 1)
              .map((list, index) => (
                <MultiListComponent
                  isMobile={props.isMobile}
                  key={index}
                  {...list}
                />
              ))}
          </div>
        }
      </div>
    </>
  )
}

export default withTranslation()(FilterComponent)
