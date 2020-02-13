import React, { Component } from "react";
import config from "react-global-configuration";
import { ReactiveList } from "@appbaseio/reactivesearch";

import Card from "./card/Card";

class ResultComponent extends Component {
  state = {
    ...config.get("resultList")
  };

  render() {
    return (
      <>
        <div className="col-md-12">
          <ReactiveList
            componentId="SearchResult"
            dataField={this.state.dataFiled}
            stream={this.state.stream}
            pagination={this.state.pagination}
            paginationAt={this.state.paginationAt}
            pages={this.state.pagesShow}
            sortBy={this.state.sortBy}
            size={this.state.sizeShow}
            loader={this.state.loader}
            showResultStats={this.state.showResultStats}
            renderItem={this.showCard}
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
      </>
    );
  }

  showCard(data) {
    return <Card key={Math.random()} {...data} />;
  }
}

export default ResultComponent;
