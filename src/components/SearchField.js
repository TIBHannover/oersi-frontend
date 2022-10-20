import React, {useState} from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import config from "react-global-configuration"
import PropTypes from "prop-types"
import {useTranslation} from "react-i18next"
import {Box, useTheme} from "@mui/material"
/**
 * SearchField Component
 * creates a search box UI component that is connected to one or more database fields,
 * and you ca define those fields from src/config/prod.json
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchField = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const [conf] = useState(config.get("searchComponent"))

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
        componentId={conf.component}
        placeholder={t("SEARCH_COMPONENT.PLACEHOLDER")}
        dataField={conf.dataField}
        fieldWeights={conf.fieldWeights}
        queryFormat={conf.queryFormat}
        fuzziness={conf.fuzziness}
        debounce={conf.debounce}
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
        URLParams={conf.URLParams}
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

SearchField.propTypes = {
  conf: PropTypes.object,
}

export default SearchField
