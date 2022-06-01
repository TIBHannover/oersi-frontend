import React from "react"
import Filters from "../components/Filters"
import OersiConfigContext from "../helpers/OersiConfigContext"
import SelectedFilters from "../components/SelectedFilters"
import {Box, useTheme} from "@mui/material"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"

const Search = (props) => {
  const theme = useTheme()
  const oersiConfig = React.useContext(OersiConfigContext)

  return (
    <>
      <Filters
        isMobile={oersiConfig.isMobile}
        onClose={() => oersiConfig.setFilterViewOpen(false)}
        open={oersiConfig.isFilterViewOpen}
      />
      <Box
        aria-label="results"
        sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
      >
        <ResultStats sx={{marginX: theme.spacing(1.5)}} />
        <SelectedFilters />
        <SearchResultList />
      </Box>
    </>
  )
}

export default Search
