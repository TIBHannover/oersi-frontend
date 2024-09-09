import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import PropTypes from "prop-types"
import {
  Box,
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
import {ImageNotSupported} from "@mui/icons-material"

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
    return content ? content.flat() : []
  }
}
const PreviewImage = (props) => {
  const {resourceId, defaultImage, imageTitle} = props
  const theme = useTheme()
  const oersiConfig = React.useContext(OersiConfigContext)
  const [thumbnailUrl, setThumbnailUrl] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
      ? getThumbnailUrl(resourceId)
      : defaultImage
  )
  const [imageAvailable, setImageAvailable] = useState(!!thumbnailUrl)
  const handleError = (e) => {
    e.target.onerror = null
    if (defaultImage !== thumbnailUrl) {
      setThumbnailUrl(defaultImage)
      setImageAvailable(!!defaultImage)
    } else {
      setImageAvailable(false)
    }
  }

  return (
    <Box
      title={imageTitle}
      sx={{
        width: "100%",
        paddingTop: "56.25%",
        position: "relative",
      }}
    >
      {imageAvailable ? (
        <CardMedia
          className="card-media"
          component="img"
          image={thumbnailUrl}
          aria-label="resource image"
          onError={handleError}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <ImageNotSupported
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: theme.spacing(5),
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </Box>
  )
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
          <PreviewImage
            resourceId={props._id}
            defaultImage={baseFieldValues.thumbnailUrl}
            imageTitle={baseFieldValues.resourceLink}
          />
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
