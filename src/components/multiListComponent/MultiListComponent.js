import React, {Component} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import "./MultiListComponent.css"
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
          />
        </div>
      </div>
    )
  }

  onLicenceRender(label, count, component) {
    if (component === "LicenseFilter") {
      return (
        <div className="col-md-11">
          <div className="row">
            <div className="col-md-9">
              <span>{label.split("/").slice(-2)[0].toUpperCase()} </span>
            </div>
            <div className="col-md-3">
              <span className="badge badge-info">{count}</span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="col-md-11">
          <div className="row">
            <div className="col-md-9">
              <span>{label} </span>
            </div>
            <div className="col-md-3">
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
