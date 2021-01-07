import React from "react"
import "./filterComponent.css"
import {SelectedFilters} from "@appbaseio/reactivesearch"
import ResultComponent from "../resultComponent/ResultComponent"
import HeaderComponent from "../headerComponent/HeaderComponent"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "../multiListComponent/MultiListComponent"
import {withTranslation} from "react-i18next"
import Button from "@material-ui/core/Button"
import CloseIcon from "@material-ui/icons/Close"
import {getLabelForStandardComponent} from "../../helpers/helpers"

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
            {props.multilist.slice(0, 4).map((list, index) => (
              <MultiListComponent isMobile={props.isMobile} key={index} {...list} />
            ))}
          </div>
        }
        <div className={"result-container"}>
          <SelectedFilters
            showClearAll={true}
            clearAllLabel={props.t("FILTER.CLEAR_ALL")}
            render={renderSelectedFilters}
          />
          <ResultComponent />
        </div>
        {
          <div
            className={"right-bar right-bar-" + (props.isMobile ? "hide" : "show")}
          >
            {props.multilist
              .slice(4, props.multilist.length + 1)
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

  function renderValue(component, value, isArray) {
    if (isArray && value.length) {
      const arrayToRender = value.map((item) =>
        renderValue(component, item, Array.isArray(item))
      )
      return arrayToRender.join(", ")
    }
    return getLabelForStandardComponent(value, component, props.t)
  }

  function renderSelectedFilters(data) {
    const selectedValues = data.selectedValues
    const appliedFilters = Object.keys(data.selectedValues)
    let hasValues = false
    return (
      <div className="selectedFilters">
        {appliedFilters
          .filter(
            (id) => data.components.includes(id) && selectedValues[id].showFilter
          )
          .map((component) => {
            const {label, value} = selectedValues[component]
            const isArray = Array.isArray(value)
            if (label && ((isArray && value.length) || (!isArray && value))) {
              hasValues = true
              return (
                <Button
                  variant="contained"
                  disableElevation
                  className="m-1"
                  key={component}
                  onClick={() => data.setValue(component, null)}
                  endIcon={<CloseIcon />}
                >
                  {selectedValues[component].label}:{" "}
                  {renderValue(component, value, isArray)}
                </Button>
              )
            }
            return null
          })}
        {hasValues ? (
          <Button
            variant="contained"
            disableElevation
            className="m-1"
            onClick={data.clearValues}
          >
            {data.clearAllLabel}
          </Button>
        ) : null}
      </div>
    )
  }
}

export default withTranslation(["translation", "lrt", "subject"])(FilterComponent)
