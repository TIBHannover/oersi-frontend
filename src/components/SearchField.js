import React from "react"
import {useSearchBox} from "react-instantsearch"
import Button from "react-bootstrap/Button"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import PropTypes from "prop-types"
import {useTranslation} from "react-i18next"
import FilterIcon from "./icons/FilterIcon"
import {useLocation} from "react-router"
import Form from "react-bootstrap/Form"
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
  const {query, refine} = useSearchBox()

  function onChangeSearchTerm(newSearchTerm) {
    refine(newSearchTerm)
  }
  // TODO implement a debounce function to avoid too many requests

  return (
    <div
      className={
        "d-flex position-relative align-items-center search-component" +
        (frontendConfig.isDarkMode ? " search-component-dark" : "")
      }
    >
      <Form className="w-100" role="search">
        <Form.Control
          className={
            "search-component-input search-component-main" +
            (frontendConfig.isDarkMode ? " bg-dark" : "") +
            (isSearchView ? " input-with-left-filter-icon" : "")
          }
          type="search"
          placeholder={t("SEARCH_COMPONENT.PLACEHOLDER")}
          value={query}
          onChange={(e) => onChangeSearchTerm(e.currentTarget.value)}
        />
        <button className="search-icon-wrapper">
          <svg
            className="search-icon"
            height="12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            style={{transform: "scale(1.35)", position: "relative", right: "0.4rem"}}
          >
            <title>Search</title>
            <path d=" M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609, 0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021, 0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338, 4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z "></path>
          </svg>
        </button>
      </Form>
      {isSearchView && (
        <Button
          variant="secondary-dark"
          className="position-absolute start-0 rounded-circle opacity-75 border-0 bg-transparent lh-1"
          aria-label="open filter drawer"
          onClick={frontendConfig.onToggleFilterViewOpen}
        >
          <FilterIcon className="fs-4" />
        </Button>
      )}

      {/*<SearchBox />*/}
      {/*<DataSearch*/}
      {/*  componentId={conf.componentId}*/}
      {/*  className="w-100"*/}
      {/*  placeholder={t("SEARCH_COMPONENT.PLACEHOLDER")}*/}
      {/*  dataField={conf.dataField}*/}
      {/*  fieldWeights={conf.fieldWeights}*/}
      {/*  queryFormat={conf.queryFormat ? conf.queryFormat : "and"}*/}
      {/*  fuzziness={conf.fuzziness !== undefined ? conf.fuzziness : 0}*/}
      {/*  debounce={conf.debounce !== undefined ? conf.debounce : 300}*/}
      {/*  autosuggest={conf.autosuggest !== undefined ? conf.autosuggest : false}*/}
      {/*  highlight={conf.highlight}*/}
      {/*  highlightField={conf.highlightField}*/}
      {/*  customHighlight={() => ({*/}
      {/*    highlight: {*/}
      {/*      pre_tags: ["<mark>"],*/}
      {/*      post_tags: ["</mark>"],*/}
      {/*      fields: {*/}
      {/*        text: {},*/}
      {/*        title: {},*/}
      {/*      },*/}
      {/*      number_of_fragments: 0,*/}
      {/*    },*/}
      {/*  })}*/}
      {/*  innerClass={{*/}
      {/*    title: "search-title",*/}
      {/*    input:*/}
      {/*      "search-component-input search-component-main" +*/}
      {/*      (frontendConfig.isDarkMode ? " bg-dark" : "") +*/}
      {/*      (isSearchView ? " input-with-left-filter-icon" : ""),*/}
      {/*    mic: "search-component-img",*/}
      {/*  }}*/}
      {/*  searchInputId="NameSearch"*/}
      {/*  iconPosition={conf.iconPosition}*/}
      {/*  showFilter={conf.showFilter}*/}
      {/*  URLParams={true}*/}
      {/*  react={{*/}
      {/*    and: conf.and,*/}
      {/*  }}*/}
      {/*  renderNoSuggestion={() => onNoSuggestion()}*/}
      {/*  renderError={(error) => onError(error)}*/}
      {/*  renderSelectedTags={() => null}*/}
      {/*/>*/}
      {/*{isSearchView && (*/}
      {/*  <Button*/}
      {/*    variant="secondary-dark"*/}
      {/*    className="position-absolute start-0 rounded-circle opacity-75 border-0 bg-transparent lh-1"*/}
      {/*    aria-label="open filter drawer"*/}
      {/*    onClick={frontendConfig.onToggleFilterViewOpen}*/}
      {/*  >*/}
      {/*    <FilterIcon className="fs-4" />*/}
      {/*  </Button>*/}
      {/*)}*/}
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
