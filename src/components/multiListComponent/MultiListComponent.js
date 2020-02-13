import React, { Component } from "react";
import { MultiList } from "@appbaseio/reactivesearch";
import "./MultiListComponent.css";
class MultiListComponent extends Component {
  render() {
    return (
      <div className="card">
        <div className="content">
          <MultiList
            dataField={this.props.dataField}
            title={this.props.title}
            componentId={this.props.component}
            placeholder={this.props.placeholder}
            showFilter={this.props.showFilter}
            filterLabel={this.props.filterLabel}
            react={{
              and: this.props.and
            }}
          />
        </div>
      </div>
    );
  }
}

export default MultiListComponent;
