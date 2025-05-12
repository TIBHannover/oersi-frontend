import React from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import Button from "react-bootstrap/Button"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import PropTypes from "prop-types"
import {useTranslation} from "react-i18next"
import FilterIcon from "./icons/FilterIcon"
import {useLocation} from "react-router"
/**
 * SearchField Component
 * creates a search box UI component that is connected to one or more database fields
 */
const SearchField = (props) => {
  const {t} = useTranslation()
  const location = useLocation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const isSearchView = location?.pathname === frontendConfig.routes.SEARCH
  const conf = frontendConfig.searchConfiguration.searchField

  return (
    <div
      className={
        "d-flex position-relative search-component" +
        (frontendConfig.isDarkMode ? " search-component-dark" : "")
      }
    >
      <DataSearch
        componentId={conf.componentId}
        className="w-100"
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
            "search-component-input search-component-main" +
            (frontendConfig.isDarkMode ? " bg-dark" : "") +
            (isSearchView ? " input-with-left-filter-icon" : ""),
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
      {isSearchView && (
        <Button
          variant="secondary-dark"
          className="position-absolute start-0 top-0 rounded-circle opacity-75 border-0 bg-transparent"
          aria-label="open filter drawer"
          onClick={frontendConfig.onToggleFilterViewOpen}
        >
          <FilterIcon className="fs-4" />
        </Button>
      )}
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
