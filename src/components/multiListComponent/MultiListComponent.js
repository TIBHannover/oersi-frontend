import React, {Component} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
class MultiListComponent extends Component {
  state = {
    onError: false,
  }
  render() {
    console.log(this.props.typeList)
    return (
      <div className="multilist card">
        <div className="multilist content">
          <div className="filter-heading center">
            <b>
              {" "}
              <i className={this.props.fontAwesome} /> {this.props.title}
            </b>
          </div>
          <hr className="blue" />
          <MultiList
            className={this.props.className}
            dataField={this.props.dataField}
            // title={this.props.title}
            componentId={this.props.component}
            placeholder={this.props.placeholder}
            showFilter={this.props.showFilter}
            showSearch={this.props.showSearch}
            filterLabel={this.props.filterLabel}
            nestedField={this.onNestedFiled(
              this.props.component,
              this.props.nestedField
            )}
            react={{
              and: this.props.and,
            }}
            renderItem={(label, count) =>
              this.onLicenceRender(label, count, this.props.component)
            }
            innerClass={{
              label: "multilist-label",
              input: "search-input",
            }}
            renderError={() => this.setState({onError: true})}
          />
        </div>
      </div>
    )
  }

  onLicenceRender(label, count, component) {
    if (component === "LicenseFilter") {
      return (
        <div className="col-11">
          <div className="row">
            <div className="col-9">
              <span className="multilist-span">
                {label.split("/").slice(-2)[0].toUpperCase()}{" "}
              </span>
            </div>
            <div className="col-2">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="col-9">
          <div className="row">
            <div className="col-9">
              <span className="multilist-span">{label} </span>
            </div>
            <div className="col-3">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    }
  }

  onNestedFiled(component, nestedField) {
    if (component === "AuthorFilter") {
      return nestedField
    } else {
      return ""
    }
  }
}

export default MultiListComponent
