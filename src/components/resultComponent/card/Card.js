import React from "react"
import moment from "moment"
import "./Card.css"

class Card extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="card-item col-md-12" key={Math.random()}>
          <div className="card-item card">
            <div className="">
              <a href={this.props.url} rel="noopener noreferrer" target="_blank">
                <h4
                  data-toggle="tooltip"
                  data-placement="left"
                  title="Tooltip on left"
                  className="title text-center "
                >
                  {this.props.name}
                </h4>
              </a>
              <hr />
              <div className="card-item row">
                <div className="col-md-10">
                  <div className="card-item-second row">
                    <div className="col-md-3"></div>
                    <div className="col-md-5">
                      <p className=" title text-center">
                        <b>Authors : </b>{" "}
                        {this.props.authors
                          .map(function (elem) {
                            return elem.fullname
                          })
                          .join(",")}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p className="category text-center">
                        License :
                        <a
                          target="_blank"
                          href={this.props.license}
                          rel="noopener noreferrer"
                        >
                          <img
                            className="licence-image"
                            alt={
                              "Licence " +
                              this.licenseSplit(this.props.license).toUpperCase()
                            }
                            title={
                              "Licence " +
                              this.licenseSplit(this.props.license).toUpperCase()
                            }
                            src={
                              "/licence/license-" +
                              this.licenseSplit(this.props.license).toLowerCase() +
                              ".png"
                            }
                          />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="col-md-12">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <a
                      target="_blank"
                      href={this.props.url}
                      rel="noopener noreferrer"
                    >
                      <img
                        src={this.props.thumbnailUrl}
                        className="card-img"
                        alt={this.props.name}
                      />
                    </a>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      {/* <a href={this.props.url}>
                        <h5 className="card-title">{this.props.subject}</h5>
                      </a> */}
                      <p className="card-text block-with-text">
                        {this.props.description}
                      </p>
                      <hr></hr>
                      <p className="card-text">
                        <small className="text-muted">
                          {moment(this.props.dateModifiedInternal).format(
                            "MMM Do YY"
                          )}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer card-footer font-size-responsive">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="row">
                    <div className="legend">
                      {this.props.keywords.map((item) => {
                        return (
                          <span
                            key={Math.random()}
                            className="badge badge-pill badge-info"
                          >
                            {item}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="stats ">
                  <i className="fa fa-history"></i>
                  <strong> Last update : </strong>
                  {moment(this.props.dateModifiedInternal).format("MMM Do YY")}
                </div>
                <div className="stats ">
                  <i className="fa fa-file"></i> <strong> Type : </strong>
                  {this.props.learningResourceType}
                </div>
                <div className="stats">
                  <i className="fa fa-language"></i>
                  <strong> Language : </strong>
                  {this.props.inLanguage.toUpperCase()}
                </div>
                <div className="stats">
                  <i className="fa fa-osi"></i>
                  <strong> Source : </strong>
                  {this.props.source}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  licenseSplit(license) {
    if (license) return license.split("/").slice(-2)[0]
  }
}

export default Card
