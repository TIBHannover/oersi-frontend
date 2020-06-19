import React, {Component, lazy} from "react"
import {ReactiveBase, SelectedFilters} from "@appbaseio/reactivesearch"
import "./App.css"
import ResultComponent from "./components/resultComponent/ResultComponent"
import SearchComponent from "./components/searchComponent/SearchComponent"
import MultiListComponent from "./components/multiListComponent/MultiListComponent"
import config from "react-global-configuration"
import FooterComponent from "./components/footerComponent/FooterComponent"
// const FooterComponent = lazy(() => import("./components/footerComponent/FooterComponent"));

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      multiList: config.get("multiList"),
      ...this.props.data,
      errorResult: false,
      isClicked: false,
      message: "🔬Show Filters",
    }
  }

  handleClick() {
    this.setState({
      isClicked: !this.state.isClicked,
      message: this.state.isClicked ? "🔬 Show Filters" : "📰 Show Resuts",
    })
  }

  handleError = (error) => {
    console.log(error)
    this.setState({errorResult: error})
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

  checkIfExeistCredencial(credencial) {
    if (credencial !== "" && credencial) {
      console.log({authorization: credencial})
      return {authorization: credencial}
    } else {
      console.log("No credencial")
      return null
    }
  }
  render() {
    return (
      <div className="wrapper">
        <ReactiveBase
          className="reactive-base"
          app={this.state.APP_NAME}
          url={this.state.URL}
          headers={this.checkIfExeistCredencial(this.state.CREDENCIAL)}
        >
          {/* <div className="navbar"> */}
          <header>
            <div>
              <h1>OERSI </h1>
              <p>Open Educational Resources Search Index</p>
            </div>
            {/* <form action="" > */}
            <SearchComponent />
            {/* </form> */}
          </header>
          {/* </div> */}
          <div className="sub-container">
            <div className={this.state.isClicked ? "left-bar-optional" : "left-bar"}>
              {this.state.multiList.slice(0, 3).map((list, index) => (
                <MultiListComponent key={index} {...list} />
              ))}
            </div>
            <div
              className={
                this.state.isClicked
                  ? "result-container-optional"
                  : "result-container"
              }
            >
              <SelectedFilters showClearAll={true} clearAllLabel="Clear filters" />
              <ResultComponent onHandleError={this.handleError.bind(this)} />
            </div>
            <div
              className={this.state.isClicked ? "right-bar-optional" : "right-bar"}
            >
              {this.state.multiList
                .slice(3, this.state.multiList.length + 1)
                .map((list, index) => (
                  <MultiListComponent key={index} {...list} />
                ))}
            </div>

            <button className="toggle-button" onClick={this.handleClick.bind(this)}>
              {this.state.message}
            </button>
          </div>
          <FooterComponent />
        </ReactiveBase>
      </div>
    )
  }
}

export default App
