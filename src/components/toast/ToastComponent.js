import React from "react";
import { toast, Zoom } from "react-toastify";
import "./ToastComponent.css";

class ToastComponent extends React.Component {
  state = {};

  notify = () => {
    toast(
      <div className="toast__container">
        <div className="toast__cell">
          <div className="toast toast--green">
            <div className="toast__icon"></div>
            <div className="toast__content">
              <p className="toast__type">{this.props.title}</p>
              <p className="toast__message">{this.props.message}</p>
            </div>
            <div className="toast__close"></div>
          </div>
        </div>
      </div>,
      {
        transition: Zoom,
        type: this.props.type,
        autoClose: 5000
      }
    );
  };

  render() {
    return <>{this.notify()}</>;
  }
}

export default ToastComponent;
