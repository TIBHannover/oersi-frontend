import React, { Component } from "react";
import { ReactiveBase, SelectedFilters } from "@appbaseio/reactivesearch";
import config from "react-global-configuration";
import "./App.css";
import ResultComponent from "./components/resultComponent/ResultComponent";
import SearchComponent from "./components/searchComponent/SearchComponent";
import MultiListComponent from "./components/multiListComponent/MultiListComponent";
import FooterComponent from "./components/footerComponent/FooterComponent";

class App extends Component {
  state = {
    ...config.get()
  };

  onRenderListLeft(element, index, array) {
    if (index <= 2) {
      return (
        <React.Fragment key={Math.random()}>
          <MultiListComponent key={index} {...element} />
          <hr />
        </React.Fragment>
      );
    }
  }

  onRenderListRight(element, index, array) {
    if (index > 2) {
      return (
        <React.Fragment key={Math.random()}>
          <MultiListComponent key={index} {...element} />
          <hr />
        </React.Fragment>
      );
    }
  }
  render() {
    return (
      <div className="wrapper">
        <ReactiveBase
          app={this.state.ELASTIC_SEARCH.APP_NAME}
          url={this.state.ELASTIC_SEARCH.URL}
        >
          <div className="main-panel">
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-10">
                    <SearchComponent />
                  </div>
                  <div className="col-md-12">
                    <div className="card">
                      <SelectedFilters />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    {this.state.multiList.map(this.onRenderListLeft)}
                  </div>

                  <div className="col-md-8">
                    <div className="">
                      <ResultComponent />
                    </div>
                  </div>

                  <div className="col-md-2">
                    {this.state.multiList.map(this.onRenderListRight)}
                  </div>
                </div>
              </div>
            </div>
            <FooterComponent />
          </div>
        </ReactiveBase>
      </div>
    );
  }
}

export default App;
