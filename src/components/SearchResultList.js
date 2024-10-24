import React, {useState} from "react"
import {useHits} from "react-instantsearch"
import Grid from "@mui/material/Grid"

import Card from "./Card"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
import PageControl from "./PageControl"
import {useRouter} from "next/router"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchResultList = (props) => {
  const router = useRouter()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  //declare varibale to get data from Configuration fle prod.json
  const [conf] = useState(frontendConfig.searchConfiguration.resultList)
  const [pageSize, setPageSize] = useState(determineInitialPageSize())
  const {items} = useHits()
  const defaultQuery = function () {
    return {
      track_total_hits: frontendConfig.TRACK_TOTAL_HITS
        ? frontendConfig.TRACK_TOTAL_HITS
        : true,
    }
  }
  return (
    <Grid container direction="row" alignItems="flex-start">
      {items.map((item) => (
        <Grid key={item.objectID} item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card {...item} resourceId={item.objectID} />
        </Grid>
      ))}
    </Grid>
  )
  function determineInitialPageSize() {
    const sizeParam = router.query["size"] ? router.query["size"] : null
    if (
      sizeParam != null &&
      frontendConfig.RESULT_PAGE_SIZE_OPTIONS.indexOf(sizeParam) !== -1
    ) {
      return parseInt(sizeParam)
    } else {
      return frontendConfig.NR_OF_RESULT_PER_PAGE
    }
  }
}

SearchResultList.propTypes = {}

export default SearchResultList
