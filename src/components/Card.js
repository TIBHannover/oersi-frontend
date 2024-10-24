import React, {useEffect, useState} from "react"
import {useTranslation} from "next-i18next"
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
import {useRouter} from "next/router"

import {getLicenseIcon, hasLicenseIcon} from "./CustomIcons"
import {
  getBaseFieldValues,
  getThumbnailUrl,
  getValuesFromRecord,
  processFieldOption,
} from "../helpers/helpers"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
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
  const {i18n} = useTranslation(["translation", "language", "labelledConcept"], {
    bindI18n: "languageChanged loaded",
  })
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["labelledConcept"])
  }, [i18n.resolvedLanguage])
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
    content = processFieldOption(content, fieldOption, i18n)
    return content ? content.flat() : []
  }
}
const PreviewImage = (props) => {
  const {resourceId, defaultImage, imageTitle} = props
  const theme = useTheme()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const [thumbnailUrl, setThumbnailUrl] = useState(
    frontendConfig.FEATURES?.SIDRE_THUMBNAILS
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
  const router = useRouter()
  const theme = useTheme()
  const {t, i18n} = useTranslation(["translation", "labelledConcept", "language"])
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["labelledConcept"])
  }, [i18n.resolvedLanguage])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const resourceId = props.resourceId || props._id
  const cardConfig = frontendConfig.resultCard
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  const baseFieldConfig = frontendConfig.fieldConfiguration?.baseFields
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    props,
    fieldsOptions,
    i18n
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
            resourceId={resourceId}
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
          onClick={() => router.push("/" + resourceId)}
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
      const licenseGroup = baseFieldValues.licenseGroup
      if (licenseGroup && licenseGroup.toUpperCase() !== "OTHER") {
        return hasLicenseIcon(licenseGroup.toLowerCase()) ? (
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
    }
    return <></>
  }
}

export default Card
