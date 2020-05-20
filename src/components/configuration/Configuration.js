import React from "react"
import {getConfiguration} from "../../service/configuration/configurationService"
import ToastComponent from "../toast/ToastComponent"
import App from "../../App"
import ErrorComponent from "../errorPage/ErrorComponent"

class Configuration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      configData: {},
      isLoaded: false,
    }
  }

  async componentDidMount() {
    await getConfiguration("/config/config.json")
      .then((r) => r.json())
      .then((dat) => {
        this.setState({
          configData: dat.ELASTIC_SEARCH,
          isLoaded: true,
        })
      })
      .catch((error) => {
        this.setState({
          configData: null,
          isLoaded: true,
        })
      })
  }

  UNSAFE_componentWillUnmount() {
    this.setState({
      configData: {},
      isLoaded: false,
    })
  }

  render() {
    return (
      <>
        {this.state.isLoaded && this.state.configData != null ? (
          <App data={this.state.configData} />
        ) : (
          ""
        )}
        {this.state.isLoaded && this.state.configData == null ? (
          <>
            <ErrorComponent />
            <ToastComponent
              message={"Something Was wrong and We can't load the page "}
              title={"Error on Load"}
              type={"error"}
            />
          </>
        ) : (
          ""
        )}
      </>
    )
  }
}

export default Configuration
