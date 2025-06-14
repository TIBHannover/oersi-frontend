import React from "react"
import SvgIcon from "./SvgIcon"

const CircleHalfIcon = (props) => {
  return (
    <SvgIcon width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
    </SvgIcon>
  )
}

export default CircleHalfIcon
