import React, {useState} from "react"
import {ReactiveBase, SelectedFilters} from "@appbaseio/reactivesearch"
import "./App.css"
import ResultComponent from "./components/resultComponent/ResultComponent"
import MultiListComponent from "./components/multiListComponent/MultiListComponent"
import FooterComponent from "./components/footerComponent/FooterComponent"
import HeaderComponent from "./components/headerComponent/HeaderComponent"
import SearchComponent from "./components/searchComponent/SearchComponent"
import FilterComponent from "./components/filterComponent/FilterComponent"

const App = (props) => {
  const [multilist] = useState(props.config.get("multiList"))

  return (
    <div className="wrapper">
      <ReactiveBase
        className="reactive-base"
        app={props.data.APP_NAME}
        url={props.data.URL}
        headers={checkIfExeistCredencial(props.data.CREDENCIAL)}
      >
        <HeaderComponent>
          <SearchComponent />
        </HeaderComponent>
        <FilterComponent
          left={multilist.slice(0, 3).map((list, index) => (
            <MultiListComponent key={index} {...list} />
          ))}
          center={
            <>
              <SelectedFilters showClearAll={true} clearAllLabel="Clear filters" />
              <ResultComponent />
            </>
          }
          right={multilist.slice(3, multilist.length + 1).map((list, index) => (
            <MultiListComponent key={index} {...list} />
          ))}
        />
        <FooterComponent />
      </ReactiveBase>
    </div>
  )

  /**
   * function to check if exist credencal for Reactive search or not
   * @param {String} credencial
   */
  function checkIfExeistCredencial(credencial) {
    if (credencial !== "" && credencial) return {authorization: credencial}
    else return null
  }
}

export default App
