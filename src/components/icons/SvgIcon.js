import React from "react"

const SvgIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={props.className || ""}
      width={props.width || "22"}
      height={props.height || "22"}
      fill="currentColor"
      viewBox={props.viewBox}
    >
      {props.children}
    </svg>
  )
}

export default SvgIcon
