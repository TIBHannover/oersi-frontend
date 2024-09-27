import React from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
import {useTranslation} from "next-i18next"
import {Box, useTheme} from "@mui/material"

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
      <DataSearch
        componentId={conf.componentId}
        placeholder={t("SEARCH_COMPONENT.PLACEHOLDER")}
        dataField={conf.dataField}
        fieldWeights={conf.fieldWeights}
        queryFormat={conf.queryFormat ? conf.queryFormat : "and"}
        fuzziness={conf.fuzziness !== undefined ? conf.fuzziness : 0}
        debounce={conf.debounce !== undefined ? conf.debounce : 100}
        autosuggest={conf.autosuggest}
        highlight={conf.highlight}
        highlightField={conf.highlightField}
        customHighlight={() => ({
          highlight: {
            pre_tags: ["<mark>"],
            post_tags: ["</mark>"],
            fields: {
              text: {},
              title: {},
            },
            number_of_fragments: 0,
          },
        })}
        innerClass={{
          title: "search-title",
          input: "search-component-input",
          mic: "search-component-img",
        }}
        searchInputId="NameSearch"
        iconPosition={conf.iconPosition}
        showFilter={conf.showFilter}
        URLParams={true}
        react={{
          and: conf.and,
        }}
        renderNoSuggestion={() => onNoSuggestion()}
        renderError={(error) => onError(error)}
        renderSelectedTags={() => null}
      />
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

export default SearchField
