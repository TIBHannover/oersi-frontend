import React from "react"
import SvgIcon from "./SvgIcon"

const PlusCircleIcon = (props) => {
  return (
    <SvgIcon
      width={props.width || "100%"}
      height={props.height || "100%"}
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </SvgIcon>
  )
}

export default PlusCircleIcon
