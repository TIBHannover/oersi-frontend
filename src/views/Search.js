import React from "react"
import {ReactiveList} from "@appbaseio/reactivesearch"
import Filters from "../components/Filters"
import ReactiveSearchComponents from "../config/ReactiveSearchComponents"
import OersiConfigContext from "../helpers/OersiConfigContext"

const Search = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)

  return (
    <>
      <Filters
        isMobile={oersiConfig.isMobile}
        onClose={() => oersiConfig.setFilterViewOpen(false)}
        open={oersiConfig.isFilterViewOpen}
      />
      <ReactiveList {...ReactiveSearchComponents.resultcard} />
    </>
  )
}

export default Search
