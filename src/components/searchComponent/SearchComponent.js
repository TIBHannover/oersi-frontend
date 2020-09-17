import React, {useState} from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import "./SearchComponent.css"
import config from "react-global-configuration"
import PropTypes from "prop-types"
import {withTranslation} from "react-i18next"
/**
 * Search Component
 * creates a search box UI component that is connected to one or more database fields,
 * and you ca define those fields from src/config/prod.json
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchComponent = (props) => {
  //declare varibale to get data from Configuration fle prod.json
  const [conf] = useState(config.get("searchComponent"))

  return (
    <div className="search-component">
      <DataSearch
        componentId={conf.component}
        placeholder={props.t("SEARCH_COMPONENT.PLACEHOLDER")}
        dataField={conf.dataField}
        fieldWeights={conf.fieldWeights}
        queryFormat={conf.queryFormat}
        fuzziness={conf.fuzziness}
        debounce={conf.debounce}
        autosuggest={conf.autosuggest}
        // defaultSuggestions={[
        //   { label: "Language", value: "de" },
        //   { label: "", value: "Musicians" }
        // ]}
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

SearchComponent.propTypes = {
  conf: PropTypes.object,
}

export default withTranslation()(SearchComponent)
