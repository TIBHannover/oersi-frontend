import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
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
  useTheme,
} from "@mui/material"
import LazyLoad from "react-lazyload"

import "./Card.css"
import {getLicenseIcon, hasLicenseIcon} from "./CustomIcons"
import {getLicenseGroup, getSafeUrl, joinArrayField} from "../helpers/helpers"
import {OersiConfigContext} from "../helpers/use-context"

const Card = (props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const defaultImage = props.image
    ? props.image
    : process.env.PUBLIC_URL + "/help_outline.svg"
  const [thumbnailUrl, setThumbnailUrl] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
      ? process.env.PUBLIC_URL + "/thumbnail/" + props._id + ".webp"
      : defaultImage
  )

  return (
    <React.Fragment>
      <MuiCard className="card-card-root" sx={{margin: theme.spacing(1.5)}}>
        <Link
          target="_blank"
          rel="noopener"
          href={getSafeUrl(props.id)}
          className="card-header-link"
          aria-label={props.name}
          underline="hover"
          color="textSecondary"
        >
          <LazyLoad offset={100} once>
            <CardMedia
              className="card-card-media"
              image={thumbnailUrl}
              title={props.id}
              aria-label="resource image"
            >
              {oersiConfig.FEATURES?.OERSI_THUMBNAILS && (
                <img
                  src={thumbnailUrl}
                  style={{display: "None"}}
                  onError={(e) => {
                    e.target.onerror = null
                    setThumbnailUrl(defaultImage)
                  }}
                  alt="fallback workaround"
                />
              )}
            </CardMedia>
          </LazyLoad>
          <CardHeader
            className="card-header-title"
            title={
              <Typography
                variant="h5"
                component="div"
                className={"card-hide-overflow card-line-clamp-two"}
                color="textSecondary"
              >
                {props.name}
              </Typography>
            }
          />
        </Link>
        <CardContent className="card-infos">
          {getDescription()}
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
        <CardActions
          className="card-actions"
          sx={{marginTop: "auto"}}
          disableSpacing
        >
          <div>{getLicense()}</div>
          <Button
            color="grey"
            className="button-details"
            onClick={() => navigate("/" + props._id)}
          >
            {t("LABEL.SHOW_DETAILS")}
          </Button>
        </CardActions>
      </MuiCard>
    </React.Fragment>
  )

  function getDescription() {
    let content = null
    if (props.description) {
      content = props.description
    } else if (props.keywords) {
      content = joinArrayField(props.keywords, (item) => item)
    }
    if (content) {
      return (
        <Typography
          variant="body1"
          aria-label="description"
          className={"card-description card-hide-overflow card-line-clamp-four"}
          color="textPrimary"
          sx={{fontWeight: 500, fontSize: theme.typography.fontSize}}
        >
          {content}
        </Typography>
      )
    }
    return ""
  }

  function getLicense() {
    if (props.license && props.license.id) {
      const licenseGroup = getLicenseGroup(props.license)
      return !licenseGroup || hasLicenseIcon(licenseGroup.toLowerCase()) ? (
        <IconButton
          className="card-action-license"
          target="_blank"
          rel="noreferrer"
          href={getSafeUrl(props.license.id)}
          aria-label={licenseGroup}
          size="large"
        >
          {getLicenseIcon(licenseGroup.toLowerCase())}
        </IconButton>
      ) : (
        <Button
          color="grey"
          className="card-action-license"
          target="_blank"
          rel="noreferrer"
          href={getSafeUrl(props.license.id)}
          aria-label={licenseGroup}
        >
          {licenseGroup}
        </Button>
      )
    }
    return ""
  }
  function getCardInfoTextEntry(text, ariaLabel) {
    return text ? (
      <Typography
        variant="body1"
        aria-label={ariaLabel}
        className={"card-info card-hide-overflow card-line-clamp-one"}
        sx={{marginTop: theme.spacing(1.5)}}
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
