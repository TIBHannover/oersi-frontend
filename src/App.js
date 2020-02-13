import React, { Component } from "react";
import {
  ReactiveBase,
  ReactiveList,
  MultiList,
  SelectedFilters,
  DataSearch
} from "@appbaseio/reactivesearch";

import moment from "moment";
import config from "react-global-configuration";
import "./App.css";
import ResultComponent from "./components/resultComponent/ResultComponent";

// Importing Images
const americanFood = "hola";

class App extends Component {
  state = {
    ...config.get("ELASTIC_SEARCH"),
    totalNumber: 0
  };

  onPopoverClick(marker) {
    return (
      <div
        className="row"
        style={{ margin: "0", maxWidth: "300px", paddingTop: 10 }}
      >
        <div className="col s12">
          <div>
            <strong>{marker.name}</strong>
          </div>
          <p style={{ margin: "5px 0", lineHeight: "18px" }}>{marker.author}</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapper">
        <ReactiveBase
          app={this.state.APP_NAME}
          url={this.state.URL}
          // transformRequest={props => ({
          //   ...props,
          //   url: props.url
          // })}
        >
          <div className="main-panel">
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-10">
                    <div className="card">
                      <div className="content">
                        <DataSearch
                          componentId="Search"
                          placeholder="Search for name , author , tags "
                          dataField={["name", "author", "tags"]}
                          fieldWeights={[1, 3]}
                          queryFormat="or"
                          fuzziness={0}
                          debounce={100}
                          autosuggest={true}
                          // defaultSuggestions={[
                          //   { label: "Language", value: "de" },
                          //   { label: "", value: "Musicians" }
                          // ]}
                          highlight={true}
                          highlightField="name"
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
                          iconPosition="right"
                          showFilter={true}
                          URLParams={false}
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="card">
                      <SelectedFilters />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <div className="card">
                      <div className="content">
                        <MultiList
                          dataField="author.keyword"
                          title="Filter Author"
                          componentId="AuthorFilter"
                          placeholder="Filter Author"
                          showFilter={true}
                          filterLabel="Filter Author"
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="card">
                      <div className="content">
                        <MultiList
                          dataField="license.keyword"
                          title="Filter by License"
                          componentId="LicenseFilter"
                          placeholder="Filter Author"
                          showFilter={true}
                          filterLabel="Filter License"
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="card">
                      <div className="content">
                        <MultiList
                          dataField="source.keyword"
                          title="Filter by source"
                          componentId="sourceFilter"
                          placeholder="Filter source"
                          showFilter={true}
                          filterLabel="Filter source"
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>

                    {/* end col 2  */}
                  </div>

                  <div className="col-md-8">
                    <div className="">
                      <ResultComponent />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="card">
                      <div className="content">
                        <MultiList
                          dataField="inlanguage.keyword"
                          title="Filter by Language"
                          componentId="inlanguageFilter"
                          placeholder="Filter Langauge"
                          showFilter={true}
                          filterLabel="Filter Language"
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="card">
                      <div className="content">
                        <MultiList
                          dataField="learningresourcetype.keyword"
                          title="Filter by Type"
                          componentId="learningresourcetypeFilter"
                          placeholder="Filter Type"
                          showFilter={true}
                          filterLabel="Filter Type"
                          react={{
                            and: [
                              "AuthorFilter",
                              "LicenseFilter",
                              "Search",
                              "sourceFilter",
                              "learningresourcetypeFilter",
                              "inlanguageFilter"
                            ]
                          }}
                        />
                      </div>
                    </div>
                    {/* end col 2  */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReactiveBase>
      </div>
    );
  }

  showCard(data) {
    return (
      <div className="col-md-12" key={Math.random()}>
        <div className="card">
          <div className="header">
            <h4 className="title text-center">{data.author}</h4>
            <p className="category text-center">License : {data.license}</p>
          </div>
          <div className="content">
            <div className="col-md-12">
              <div className="row no-gutters">
                <div className="col-md-5">
                  <img src={data.thumbnail} className="card-img" />
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title">{data.name}</h5>
                    <p className="card-text">{data.about}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        {moment(data.timestamp).format("MMM Do YY")}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer">
              <div className="legend">
                {data.tags.split(" ").map(item => {
                  return (
                    <span
                      key={Math.random()}
                      className="badge badge-pill badge-info"
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
              <hr />
              <div className="stats">
                <i className="fa fa-history"></i>
                <strong> Last update : </strong>
                {moment(data.modificationdate).format("MMM Do YY")}
              </div>
              <div className="stats">
                <i className="fa fa-file"></i> <strong> Type : </strong>
                {data.learningresourcetype}
              </div>
              <div className="stats">
                <i className="fa fa-language"></i>
                <strong> Language : </strong>
                {data.inlanguage}
              </div>
              <div className="stats">
                <i className="fa fa-osi"></i>
                <strong> Source : </strong>
                {data.source}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
