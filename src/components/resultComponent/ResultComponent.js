import React, {Component} from "react"
import config from "react-global-configuration"
import {ReactiveList} from "@appbaseio/reactivesearch"
import "./ResultComponent.css"
import Card from "./card/Card"

class ResultComponent extends Component {
  state = {
    ...config.get("resultList"),
  }

  render() {
    return (
      <>
        <div className="result-list col-md-12">
          <ReactiveList
            componentId={this.state.component}
            dataField={this.state.dataFiled}
            stream={this.state.stream}
            pagination={this.state.pagination}
            paginationAt={this.state.paginationAt}
            pages={this.state.pagesShow}
            sortBy={this.state.sortBy}
            size={this.state.sizeShow}
            loader={this.state.loader}
            showResultStats={this.state.showResultStats}
            URLParams={this.state.URLParams}
            renderItem={this.showCard}
            react={{
              and: this.state.and,
            }}
            noResults="No results were found..."
            sortOptions={this.state.sortByDynamic}
          />
        </div>
      </>
    )
  }

  showCard(data) {
    return <Card key={Math.random()} {...data} />
  }
}

export default ResultComponent
