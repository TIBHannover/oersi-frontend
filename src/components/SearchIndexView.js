import React from "react"
import {DataSearch, ReactiveList} from "@appbaseio/reactivesearch"

const SearchIndexView = (props) => {
  return (
    <>
      <ReactiveList {...props.components.resultcard} />
    </>
  )
}

export default SearchIndexView
