import React from "react";
import moment from "moment";
import "./Card.css";

class Card extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="col-md-12" key={Math.random()}>
          <div className="card">
            <div className="">
              <a href={this.props.url}>
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
              <div className="row">
                <div className="col-md-10">
                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-5">
                      <p className=" title text-center">
                        <b>Author : </b> {this.props.author}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p className="category text-center">
                        License : {this.props.license}
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
                    <a href={this.props.url}>
                      <img
                        src={this.props.thumbnail}
                        className="card-img"
                        alt={this.props.name}
                      />
                    </a>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      {/* <a href={this.props.url}>
                        <h5 className="card-title">{this.props.name}</h5>
                      </a> */}
                      <p className="card-text block-with-text">
                        {this.props.about}
                      </p>
                      <hr></hr>
                      <p className="card-text">
                        <small className="text-muted">
                          {moment(this.props.timestamp).format("MMM Do YY")}
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
                      {this.props.tags.split(/,| /).map(item => {
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
                  </div>
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-history"></i>
                  <strong> Last update : </strong>
                  {moment(this.props.modificationdate).format("YYYY.MM.DD")}
                </div>
                <div className="stats">
                  <i className="fa fa-file"></i> <strong> Type : </strong>
                  {this.props.learningresourcetype}
                </div>
                <div className="stats">
                  <i className="fa fa-language"></i>
                  <strong> Language : </strong>
                  {this.props.inlanguage}
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
    );
  }
}

export default Card;
