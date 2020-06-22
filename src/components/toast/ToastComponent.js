import React from "react"
import {toast, Zoom} from "react-toastify"
import "./ToastComponent.css"

const ToastComponent = (props) => {
  return <>{notify({...props})}</>

  function notify({title, message, type}) {
    return toast(
      <div className="toast__container">
        <div className="toast__cell">
          <div className="">
            <div className="toast__icon"></div>
            <div className="toast__content">
              <p className="toast__type">{title}</p>
              <p className="toast__message">{message}</p>
            </div>
            <div className="toast__close"></div>
          </div>
        </div>
      </div>,
      {
        transition: Zoom,
        type: type,
        autoClose: 5000,
      }
    )
  }
}
export default ToastComponent
