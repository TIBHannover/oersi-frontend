import React, { Component } from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import "./SearchComponent.css";
import config from "react-global-configuration";

class SearchComponent extends Component {
  state = {
    ...config.get("searchComponent")
  };

  render() {
    return (
      <div className="card card-width">
        <div className="content">
          <DataSearch
            componentId={this.state.component}
            placeholder={this.state.placeholder}
            dataField={this.state.dataField}
            fieldWeights={this.state.fieldWeights}
            queryFormat={this.state.queryFormat}
            fuzziness={this.state.fuzziness}
            debounce={this.state.debounce}
            autosuggest={this.state.autosuggest}
            // defaultSuggestions={[
            //   { label: "Language", value: "de" },
            //   { label: "", value: "Musicians" }
            // ]}
            highlight={this.state.highlight}
            highlightField={this.state.highlightField}
            customHighlight={props => ({
              highlight: {
                pre_tags: ["<mark>"],
                post_tags: ["</mark>"],
                fields: {
                  text: {},
                  title: {}
                },
                number_of_fragments: 0
              }
            })}
            searchInputId="NameSearch"
            iconPosition={this.state.iconPosition}
            showFilter={this.state.showFilter}
            URLParams={this.state.URLParams}
            react={{
              and: this.state.and
            }}
          />
        </div>
      </div>
    );
  }
}

export default SearchComponent;
