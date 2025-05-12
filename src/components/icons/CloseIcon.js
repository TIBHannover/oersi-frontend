import React from "react"
import SvgIcon from "./SvgIcon"

const CloseIcon = (props) => {
  return (
    <SvgIcon width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </SvgIcon>
  )
}

export default CloseIcon
