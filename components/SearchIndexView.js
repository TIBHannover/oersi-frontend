import React from "react"
import {DataSearch, ReactiveList} from "@appbaseio/reactivesearch"

const SearchIndexView = (props) => {
  return (
    <>
      <nav className="nav">
        <div className="title">OERSI</div>
        <DataSearch {...props.components.datasearch} />
      </nav>
      <ReactiveList {...props.components.resultcard} />
    </>
  )
}

export default SearchIndexView