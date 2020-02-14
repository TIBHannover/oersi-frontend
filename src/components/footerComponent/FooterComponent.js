import React, { Component } from "react";

class FooterComponent extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <nav className="pull-left">
            <ul>
              <li>
                <a href={"https://www.tib.eu/"}>TIB</a>
              </li>
              <li>
                <a href={"https://www.tib.eu/"}>Datenschutz</a>
              </li>
              <li>
                <a href={"https://www.tib.eu/"}>Github</a>
              </li>
              <li>
                <a href={"https://www.tib.eu/"}>Blog</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            <b>© {new Date().getFullYear()}</b>
            {"  "}
            <a
              style={{ marginLeft: "10px" }}
              href="http://www.creative-tim.com"
            >
              TIB{" "}
            </a>
            ,Hannover Germany
          </p>
        </div>
      </footer>
    );
  }
}

export default FooterComponent;
