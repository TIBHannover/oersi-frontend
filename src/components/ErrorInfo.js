import React from "react"
import Card from "react-bootstrap/Card"

const ErrorInfo = (props) => {
  const {statusCode, statusText} = props
  return (
    <Card
      className="error-message"
      style={{textAlign: "center"}}
      aria-label="error-message"
    >
      <div className="p-5">
        <div className="display-1">{statusCode}</div>
      </div>
      <div className="p-4">
        <div className="h2">{statusText || getDefaultMessage()}</div>
      </div>
    </Card>
  )

  function getDefaultMessage() {
    if (statusCode === 404) {
      return "The page you are looking for was not found."
    }
    return "Internal Server Error"
  }
}

export default ErrorInfo
