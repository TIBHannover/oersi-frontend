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

import {getLicenseIcon, hasLicenseIcon} from "./CustomIcons"
import {
  getBaseFieldValues,
  getLicenseGroupById,
  getThumbnailUrl,
  getValuesFromRecord,
  processFieldOption,
} from "../helpers/helpers"
import {OersiConfigContext} from "../helpers/use-context"

const CardText = (props) => {
  const {
    componentConfig,
    fieldOption,
    record,
    align,
    color,
    showEmpty,
    sx,
    variant,
  } = props
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const curVariant = variant || "body1"
  const content = getContent()
  return (
    (showEmpty || content.length > 0) && (
      <Typography
        align={align}
        color={color}
        variant={curVariant}
        className={
          "card-text card-" +
          (componentConfig.field
            ? componentConfig.field.replace(".", "-")
            : "empty") +
          " card-" +
          curVariant
        }
        sx={getStyle()}
        component="div"
      >
        {content.join(", ")}
      </Typography>
    )
  )

  function getStyle() {
    const style = {
      WebkitLineClamp: (componentConfig.maxLines || 1).toString(),
    }
    if (componentConfig.bold) {
      if (["body1"].includes(curVariant)) {
        style["fontWeight"] = 500
      } else {
        style["fontWeight"] = theme.typography.fontWeightBold
      }
    }
    return {...sx, ...style}
  }

  function getContent() {
    if (!componentConfig) {
      return []
    }
    let content = getValuesFromRecord({field: componentConfig.field}, record)
      .filter((v) => v.field)
      .map((v) => v.field)
    if (content.length === 0 && componentConfig.fallback) {
      for (const fb of componentConfig.fallback) {
        content = getValuesFromRecord({field: fb}, record)
          .filter((v) => v.field)
          .map((v) => v.field)
        if (content.length > 0) {
          break
        }
      }
    }
    content = processFieldOption(content, fieldOption, t)
    return content
  }
}

const Card = (props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const cardConfig = oersiConfig.resultCard
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  const baseFieldConfig = oersiConfig.fieldConfiguration?.baseFields
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    props,
    fieldsOptions,
    t
  )
  const defaultImage = baseFieldValues.thumbnailUrl
    ? baseFieldValues.thumbnailUrl
    : process.env.PUBLIC_URL + "/help_outline.svg"
  const [thumbnailUrl, setThumbnailUrl] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
      ? getThumbnailUrl(props._id)
      : defaultImage
  )

  return (
    <MuiCard className="card-root" sx={{margin: theme.spacing(1.5)}}>
      <Link
        target="_blank"
        rel="noopener"
        href={baseFieldValues.resourceLink}
        className="card-header-link"
        aria-label={baseFieldValues.title}
        underline="hover"
        color="textSecondary"
        sx={{fontWeight: theme.typography.fontWeightBold}}
      >
        <LazyLoad offset={100} once>
          <CardMedia
            className="card-media"
            image={thumbnailUrl}
            title={baseFieldValues.resourceLink}
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
          sx={{
            alignItems: "start",
            paddingTop: theme.spacing(1),
            paddingBottom: 0,
          }}
          title={
            <>
              <CardText
                componentConfig={{bold: true, ...cardConfig.subtitle}}
                fieldOption={getFieldOption(cardConfig.subtitle?.field)}
                record={props}
                variant="subtitle2"
                showEmpty={true}
              />
              <CardText
                componentConfig={{
                  bold: true,
                  maxLines: 2,
                  field: baseFieldConfig.title,
                  ...cardConfig.title,
                }}
                fieldOption={getFieldOption(
                  cardConfig.title?.field || baseFieldConfig.title
                )}
                record={props}
                variant="h6"
                color="primary"
              />
            </>
          }
        />
      </Link>
      <CardContent
        className="card-infos"
        sx={{paddingBottom: theme.spacing(1), paddingTop: 0}}
      >
        {cardConfig.content?.map((e) => (
          <CardText
            key={e.field}
            componentConfig={e}
            fieldOption={getFieldOption(e.field)}
            record={props}
            sx={{marginTop: theme.spacing(1)}}
          />
        ))}
      </CardContent>
      <CardActions className="card-actions" sx={{marginTop: "auto"}} disableSpacing>
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
  )

  function getFieldOption(fieldName) {
    return fieldsOptions?.find((x) => x.dataField === fieldName)
  }

  function getLicense() {
    if (baseFieldValues.licenseUrl) {
      const licenseGroup = getLicenseGroupById(baseFieldValues.licenseUrl)
      return !licenseGroup || hasLicenseIcon(licenseGroup.toLowerCase()) ? (
        <IconButton
          className="card-action-license"
          target="_blank"
          rel="noreferrer"
          href={baseFieldValues.licenseUrl}
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
          href={baseFieldValues.licenseUrl}
          aria-label={licenseGroup}
        >
          {licenseGroup}
        </Button>
      )
    }
    return ""
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default Card
