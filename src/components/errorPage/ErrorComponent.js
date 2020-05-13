import React from "react"
import "./ErrorComponent.css"

class ErrorComponent extends React.Component {
  state = {}

  render() {
    return (
      <>
        <div className="err-info">
          contact us :
          <a
            href="mailto:edmond.kacaj@tib.eu?subject=Mail from Our Site "
            target="_blank"
            rel="noopener noreferrer"
          >
            email
          </a>
          <a href="tel:015257484208" target="_blank" rel="noopener noreferrer">
            phone
          </a>
        </div>

        <div className="err-box">
          <div>close !</div>
          <p>
            <span>
              error <b>404 !</b>{" "}
            </span>{" "}
            Sorry something was wrong and we can't load the page{" "}
          </p>
        </div>
      </>
    )
  }
}

export default ErrorComponent
