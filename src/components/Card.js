import React, {useState} from "react"
import {useTranslation} from "next-i18next"
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
import {useRouter} from "next/router"

// import "./Card.css"
import {getLicenseIcon, hasLicenseIcon} from "./CustomIcons"
import {
  getLicenseGroup,
  getSafeUrl,
  getThumbnailUrl,
  joinArrayField,
} from "../helpers/helpers"
import OersiConfigContext from "../helpers/OersiConfigContext"

const Card = (props) => {
  const router = useRouter()
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const defaultImage = props.image
    ? props.image
    : process.env.PUBLIC_URL + "/help_outline.svg"
  const [thumbnailUrl, setThumbnailUrl] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
      ? getThumbnailUrl(props._id)
      : defaultImage
  )

  return (
    <React.Fragment>
      <MuiCard
        className="card-card-root"
        sx={{
          margin: theme.spacing(1.5),
          boxShadow: "9px 10px 20px -10px #3f4a4d !important",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link
          target="_blank"
          rel="noopener"
          href={getSafeUrl(props.id)}
          className="card-header-link"
          aria-label={props.name}
          underline="hover"
          color="textSecondary"
          sx={{fontWeight: 700}}
        >
          <LazyLoad offset={100} once>
            <CardMedia
              className="card-card-media"
              image={thumbnailUrl}
              title={props.id}
              aria-label="resource image"
              sx={{height: 0, paddingTop: "56.25%"}}
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
                sx={{
                  display: "-webkit-box",
                  "-webkit-box-orient": "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "-webkit-line-clamp": "2",
                }}
              >
                {props.name}
              </Typography>
            }
            sx={{
              minHeight: "84px",
              ".MuiTypography-root": {
                textAlign: "center",
                fontWeight: 700,
              },
            }}
          />
        </Link>
        <CardContent className="card-infos" sx={{minHeight: "181px"}}>
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
          sx={{marginTop: "auto", minHeight: "60px"}}
          disableSpacing
        >
          <div>{getLicense()}</div>
          <Button
            color="grey"
            className="button-details"
            onClick={() => router.push("/" + props._id)}
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
          sx={{
            fontWeight: 500,
            fontSize: theme.typography.fontSize,
            display: "-webkit-box",
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "-webkit-line-clamp": "4",
          }}
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
        sx={{
          marginTop: theme.spacing(1.5),
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "-webkit-line-clamp": "1",
        }}
        component="div"
      >
        {text}
      </Typography>
    ) : (
      ""
    )
  }
}

export default Card
