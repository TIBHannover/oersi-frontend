import React from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import PropTypes from "prop-types"
import {useTranslation} from "react-i18next"
/**
 * SearchField Component
 * creates a search box UI component that is connected to one or more database fields
 */
const SearchField = (props) => {
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const conf = frontendConfig.searchConfiguration.searchField

  return (
    <div
      className={
        "search-component" +
        (frontendConfig.isDarkMode ? " search-component-dark" : "")
      }
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
          input:
            "search-component-input" + (frontendConfig.isDarkMode ? " bg-dark" : ""),
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
    </div>
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
