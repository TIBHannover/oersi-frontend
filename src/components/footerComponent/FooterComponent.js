import React, {Component} from "react"
import "./FooterComponent.css"
class FooterComponent extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <br />
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-4 footer-block">
              <h5>OERSI</h5>
              <hr />
              {/* <div className="row"> */}
              {/* <div className="col-sm-6">
                     <img src="/TIB_Logo_en.png" alt="TIB LOGO" />
                   </div> */}
              {/* <div className="col-sm-12"> */}
              <p>
                Ein Suchindex für Open Educational Resources in der Hochschullehre
              </p>
              {/* </div> */}
              {/* </div>                  */}
            </div>
            <div className="col-sm-3 footer-block">
              <h5>About</h5>
              <hr />
              <ul>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://www.tib.eu/de/service/impressum"}
                  >
                    Impressum
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://www.tib.eu/de/service/datenschutz"}
                  >
                    Datenschutz
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-3 footer-block">
              <h5>Technisch</h5>
              <hr />
              <ul>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={" https://gitlab.com/oersi"}
                  >
                    GitLab
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://gitlab.com/groups/oersi/-/issues"}
                  >
                    Issues
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-2"></div>
            <br />
            <div className="col-sm-8">
              <hr />
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-3">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://www.tib.eu/de/"}
                  >
                    <img
                      className="img-block"
                      src={process.env.PUBLIC_URL + "/TIB_Logo_en.png"}
                      alt="TIB LOGO"
                    />
                  </a>
                </div>
                <div className="col-sm-3">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://www.hbz-nrw.de/"}
                  >
                    {" "}
                    <img
                      className="img-block"
                      src={process.env.PUBLIC_URL + "/Hbz-Logo.svg"}
                      alt="TIB LOGO"
                    />
                  </a>
                </div>

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
      </footer>
    )
  }
}

export default FooterComponent
