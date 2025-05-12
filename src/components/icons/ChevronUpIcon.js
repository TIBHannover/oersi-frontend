import React from "react"
import SvgIcon from "./SvgIcon"

const ChevronUpIcon = (props) => {
  return (
    <SvgIcon width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
      />
    </SvgIcon>
  )
}

export default ChevronUpIcon
