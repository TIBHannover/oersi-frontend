import React, {useState, useEffect} from "react"
import {SearchBox, useSearchBox} from "react-instantsearch"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
import {useTranslation} from "next-i18next"
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  useTheme,
} from "@mui/material"

const SearchField = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const conf = frontendConfig.searchConfiguration.searchField

  return (
    <Box
      className={
        "search-component" +
        (theme.palette.mode === "dark" ? " search-component-dark" : "")
      }
      sx={{
        fontSize: theme.typography.fontSize,
        "& .search-component-input": {
          fontSize: theme.typography.fontSize,
        },
        "& li": {
          fontSize: theme.typography.fontSize,
        },
        "& .input-group": {
          boxShadow: "unset",
        },
      }}
    >
      <SearchBoxWithSuggestions />
    </Box>
  )
  function onError(error) {
    return (
      <div>
        Something went wrong!
        <br />
        Error details
        <br />
        {error}
      </div>
    )
  }

  function onNoSuggestion() {
    return <div>No suggestions found</div>
  }
}

const SearchBoxWithSuggestions = () => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const {query, refine} = useSearchBox()
  const [inputValue, setInputValue] = useState(query)

  function setQuery(newQuery) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    // ;(async () => {
    //   const response = await axios.get("/api/suggestions") // Replace with your API endpoint
    //   if (active) {
    //     setOptions(response.data)
    //   }
    // })()
    setOptions([
      {name: "GitHub"},
      {name: "GitLab"},
      {name: "Bitbucket"},
      {name: "GitKraken"},
      {name: "Git"},
    ])
    setLoading(false)

    return () => {
      active = false
    }
  }, [loading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      event.defaultMuiPrevented = true
      // Handle the submission logic here
      // console.log("Submitted value:", event.target.value)
      // You can call a function to handle the submission
      setQuery(event.target.value)
    }
  }

  return (
    <Autocomplete
      id="search-box"
      freeSolo
      onKeyDown={handleKeyDown}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(event, value) => {
        if (value.length >= 3) {
          // Fetch suggestions when input length is 3 or more
          setLoading(true)
        } else {
          setLoading(false)
        }
      }}
      getOptionLabel={(option) => option.name} // Adjust according to your data structure
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          // onKeyDown={handleKeyDown}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchField
