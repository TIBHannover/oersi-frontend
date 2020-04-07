import React, {Component} from "react"
import {ReactiveBase, SelectedFilters} from "@appbaseio/reactivesearch"
import "./App.css"
import ResultComponent from "./components/resultComponent/ResultComponent"
import SearchComponent from "./components/searchComponent/SearchComponent"
import MultiListComponent from "./components/multiListComponent/MultiListComponent"
import FooterComponent from "./components/footerComponent/FooterComponent"
import config from "react-global-configuration"

class App extends Component {
  state = {
    multiList: config.get("multiList"),
    ...this.props.data,
  }

  onRenderListLeft(element, index, array) {
    if (index <= 2) {
      return (
        <React.Fragment key={Math.random()}>
          <MultiListComponent key={index} {...element} />
          <hr />
        </React.Fragment>
      )
    }
  }

  onRenderListRight(element, index, array) {
    if (index > 2) {
      return (
        <React.Fragment key={Math.random()}>
          <MultiListComponent key={index} {...element} />
          <hr />
        </React.Fragment>
      )
    }
  }
  render() {
    return (
      <div className="wrapper">
        <ReactiveBase app={this.state.APP_NAME} url={this.state.URL}>
          <nav className="navbar ">
            <div className="container-fluid header-margin">
              <h3 className="navbar-brand ">OER Search Index</h3>
            </div>
            <SearchComponent />
          </nav>
          <div className="main-panel">
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <SelectedFilters />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    {this.state.multiList.map(this.onRenderListLeft)}
                  </div>

                  <div className="col-md-6">
                    <div className="">
                      <ResultComponent />
                    </div>
                  </div>

                  <div className="col-md-3">
                    {this.state.multiList.map(this.onRenderListRight)}
                  </div>
                </div>
              </div>
            </div>
            <FooterComponent />
          </div>
        </ReactiveBase>
      </div>
    )
  }
}

export default App
