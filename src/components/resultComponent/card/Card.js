import React from "react"
import moment from "moment"
import "./Card.css"
import {withTranslation} from "react-i18next"
import PropTypes from "prop-types"
import LinkComponent from "../../linkComponent/LinkComponent"

const Card = (props) => {
  return (
    <React.Fragment>
      <div className="card-item col-md-12">
        <div className="card-item-card card">
          <div className="">
            <LinkComponent link={props.url}>
              <h4
                data-toggle="tooltip"
                data-placement="left"
                title="Tooltip on left"
                className="text-center "
              >
                {props.name}
              </h4>
            </LinkComponent>
            <hr />
            <div className="card-item-row row">
              <div className="col-md-10">
                <div className="card-item-second row">
                  <div className="col-md-10">
                    <p className="author-text">
                      <b>{props.t("CARD.AUTHOR")} : </b>{" "}
                      {props.authors
                        .map(function (elem) {
                          return elem.fullname
                        })
                        .join(",")}
                    </p>
                  </div>
                  <div className="col-md-2">
                    <div className="licence category text-center">
                      <b>{props.t("CARD.LICENSE")}: </b>{" "}
                      <LinkComponent link={props.license}>
                        <img
                          className="licence-image"
                          alt={
                            "Licence " + licenseSplit(props.license).toUpperCase()
                          }
                          title={
                            "Licence " + licenseSplit(props.license).toUpperCase()
                          }
                          src={
                            process.env.PUBLIC_URL +
                            "/licence/" +
                            licenseSplit(props.license).toLowerCase() +
                            ".svg"
                          }
                        />
                      </LinkComponent>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="col-md-12">
              <div className="row no-gutters">
                <div className="col-md-4">
                  <LinkComponent link={props.url}>
                    <img
                      src={props.thumbnailUrl}
                      className="card-img"
                      alt={props.name}
                    />
                  </LinkComponent>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p className="card-text block-with-text">{props.description}</p>
                    <p className="card-text">
                      {/* <small className="text-muted">
                        {moment(props.dateModifiedInternal).format("MMM Do YY")}
                      </small> */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer font-size-responsive">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <div className="row">
                  <div className="legend">
                    {props.keywords.map((item) => {
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
              {/* <hr /> */}
              <div className="stats ">
                <i className="fa fa-history"></i>
                <strong> {props.t("CARD.DATE_MODIFIED")}: </strong>
                {moment(props.dateModifiedInternal).format("MMM Do YY")}
              </div>
              <div className="stats ">
                <i className="fa fa-file"></i>{" "}
                <strong>{props.t("CARD.RESOURSE_TYPE")}: </strong>
                {props.learningResourceType}
              </div>
              <div className="stats">
                <i className="fa fa-language"></i>
                <strong>{props.t("CARD.LANGUAGE")}: </strong>
                {props.inLanguage.toUpperCase()}
              </div>
              <div className="stats">
                <i className="fa fa-osi"></i>
                <strong> {props.t("CARD.SOURCE")}: </strong>
                {props.source}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )

  /**
   * split the license and get last 2 chars
   * @param {string} license
   */
  function licenseSplit(license) {
    if (license) return license.split("/").slice(-2)[0]
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default withTranslation()(Card)
