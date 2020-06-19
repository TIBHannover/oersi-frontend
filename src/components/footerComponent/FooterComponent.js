import React, {Component} from "react"
import "./FooterComponent.css"
import {getConfiguration} from "../../service/configuration/configurationService"
class FooterComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      isLoaded: false,
    }
  }

  async componentDidMount() {
    await getConfiguration("/footerConfig/config.json")
      .then((r) => r.json())
      .then((json) => {
        this.setState({
          data: json,
          isLoaded: true,
        })
      })
      .catch((error) => {
        this.setState({
          data: {},
          isLoaded: false,
        })
      })
  }
  render() {
    return (
      <footer className="footer">
        {this.state.isLoaded ? (
          <div className="container-fluid">
            <br />
            <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-4 footer-block">
                <h5>{this.state.data.footerText.title}</h5>
                <hr />
                <div className="col-sm-12">
                  <p className="fotter-p">{this.state.data.footerText.text}</p>
                </div>
              </div>
              {this.state.data.footerLinks !== "undefined" &&
                this.state.data.footerLinks
                  .slice(0, 2)
                  .map((dataFooter, indexFooter) => (
                    <div className="col-sm-3 footer-block" key={indexFooter}>
                      <h5>{dataFooter.title}</h5>
                      <hr />
                      <ul>
                        {dataFooter.links.map((data, index) => (
                          <li key={index}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={data.link}
                            >
                              {data.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              <div className="col-sm-2"></div>
              <br />
              <div className="col-sm-8">
                <hr />
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-2"></div>
                  {this.state.data.footerImage !== "undefined" &&
                    this.state.data.footerImage.slice(0, 3).map((data, index) => (
                      <div className="col-sm-3" key={index}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={data.link}
                        >
                          <img
                            className="img-block"
                            src={process.env.PUBLIC_URL + "/" + data.image}
                            alt="LOGO"
                          />
                        </a>
                      </div>
                    ))}
                  <div className="col-sm-1"></div>
                </div>
              </div>
            </div>
            <p className="copyright pull-right">
              <b>© {new Date().getFullYear()}</b>
              {"  "}
              <a style={{marginLeft: "10px"}} href={"https://www.tib.eu/"}>
                TIB{" "}
              </a>
              ,Hannover Germany
            </p>
          </div>
        ) : (
          ""
        )}
      </footer>
    )
  }
}

export default FooterComponent
