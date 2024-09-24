"use client"

import React from "react"
import ResourceDetails from "../../../../src/views/ResourceDetails"

const DetailPage = (props) => {
  return (
    <ResourceDetails
      resourceId={props.resourceId}
      record={props.record}
      error={props.error}
    />
  )
}

export default DetailPage
