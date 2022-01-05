import React from "react"
import {useTranslation} from "react-i18next"
import PropTypes from "prop-types"
import {
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Typography,
} from "@mui/material"
import LazyLoad from "react-lazyload"

import "./Card.css"
import {getLicenseIcon} from "./CustomIcons"
import {getLicenseGroup, getSafeUrl, joinArrayField} from "../helpers/helpers"

const Card = (props) => {
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])

  const licenseGroup = getLicenseGroup(props.license).toLowerCase()
  return (
    <React.Fragment>
      <MuiCard className="card-card-root m-3">
        <Link
          target="_blank"
          rel="noopener"
          href={getSafeUrl(props.id)}
          className="card-header-link"
          aria-label={props.name}
          underline="hover"
        >
          <LazyLoad offset={100} once>
            <CardMedia
              className="card-card-media"
              image={
                props.image
                  ? props.image
                  : process.env.PUBLIC_URL + "/help_outline.svg"
              }
              title={props.id}
            />
          </LazyLoad>
          <CardHeader
            className="card-header-title"
            title={
              <Typography
                variant="h5"
                component="div"
                className={"card-hide-overflow card-line-clamp-two"}
              >
                {props.name}
              </Typography>
            }
          />
        </Link>
        <CardContent className="card-infos">
          {props.description && (
            <Typography
              variant="body1"
              className={"card-description card-hide-overflow card-line-clamp-four"}
            >
              {props.description}
            </Typography>
          )}
          {getCardInfoTextEntry(
            joinArrayField(
              props.about,
              (item) => item.id,
              (label) =>
                t("subject#" + label, {
                  keySeparator: false,
                  nsSeparator: "#",
                })
            )
          )}
          {getCardInfoTextEntry(
            joinArrayField(
              props.learningResourceType,
              (item) => item.id,
              (label) => t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
            )
          )}
        </CardContent>
        <CardActions className="card-actions mt-auto" disableSpacing>
          <div>
            {props.license && props.license.id && (
              <IconButton
                className="card-action-license"
                target="_blank"
                rel="noreferrer"
                href={getSafeUrl(props.license.id)}
                aria-label={licenseGroup}
                size="large"
              >
                {getLicenseIcon(licenseGroup)}
              </IconButton>
            )}
          </div>
          <Button
            color="grey"
            className="button-details"
            href={process.env.PUBLIC_URL + "/" + props._id}
            key={"button-details" + props._id}
          >
            {t("LABEL.SHOW_DETAILS")}
          </Button>
        </CardActions>
      </MuiCard>
    </React.Fragment>
  )

  function getCardInfoTextEntry(text, ariaLabel) {
    return text ? (
      <Typography
        variant="body1"
        aria-label={ariaLabel}
        className={"card-info mt-3 card-hide-overflow card-line-clamp-one"}
        component="div"
      >
        {text}
      </Typography>
    ) : (
      ""
    )
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default Card
