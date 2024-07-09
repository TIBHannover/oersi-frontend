import React, {useEffect, useState} from "react"
import Head from "next/head"
import {useTranslation} from "next-i18next"
import {
  Box,
  Button,
  Container,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material"
import {
  Input as InputIcon,
  ReportProblem as ReportProblemIcon,
  ThumbUp,
} from "@mui/icons-material"
import {useRouter} from "next/router"
import {sort} from "json-keys-sort"
import parse from "html-react-parser"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../components/ErrorInfo"
import {getResource} from "../api/backend/resources"
import {
  formatDate,
  getBaseFieldValues,
  getEmbedValues,
  getLicenseGroupById,
  getSafeUrl,
  getThumbnailUrl,
  getValueFromRecord,
  getValuesFromRecord,
  processFieldOption,
} from "../helpers/helpers"
import {
  getDefaultHtmlEmbeddingStyles,
  getHtmlEmbedding,
  isEmbeddable,
} from "../helpers/embed-helper"
import OersiConfigContext from "../helpers/OersiConfigContext"
import {
  getLicenseIcon,
  hasLicenseIcon,
  JsonLinkedDataIcon,
} from "../components/CustomIcons"
import EmbedDialog from "../components/EmbedDialog"

const MetaTags = (props) => {
  const {baseFieldValues, record, resourceId, siteName} = props
  const oersiConfig = React.useContext(OersiConfigContext)
  const canonicalUrl = oersiConfig.PUBLIC_URL + "/" + resourceId
  const encodedUrl = encodeURIComponent(canonicalUrl)
  return (
    <Head htmlAttributes={{prefix: "og: https://ogp.me/ns#"}}>
      <title>
        {baseFieldValues.title} - {siteName}
      </title>
      {baseFieldValues.description && (
        <meta name="description" content={baseFieldValues.description} />
      )}
      {baseFieldValues.author && (
        <meta name="author" content={baseFieldValues.author.join(", ")} />
      )}
      {baseFieldValues.keywords && (
        <meta name="keywords" content={baseFieldValues.keywords.join(", ")} />
      )}
      <link rel="canonical" href={canonicalUrl} />
      {baseFieldValues.licenseUrl && (
        <link rel="license" href={baseFieldValues.licenseUrl} />
      )}
      <link
        rel="alternate"
        type="application/json+oembed"
        href={oersiConfig.PUBLIC_URL + "/api/oembed-json?url=" + encodedUrl}
        title={baseFieldValues.title}
      />
      <link
        rel="alternate"
        type="text/xml+oembed"
        href={oersiConfig.PUBLIC_URL + "/api/oembed-xml?url=" + encodedUrl}
        title={baseFieldValues.title}
      />

      <meta property="og:title" content={baseFieldValues.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      {baseFieldValues.description && (
        <meta property="og:description" content={baseFieldValues.description} />
      )}
      {baseFieldValues.thumbnailUrl && (
        <meta property="og:image" content={baseFieldValues.thumbnailUrl} />
      )}

      <meta name="twitter:card" content="summary" />

      <script type="application/ld+json">{getJsonEmbedding()}</script>
    </Head>
  )

  function getJsonEmbedding() {
    let jsonEmbedding = {...record}
    oersiConfig.embeddedStructuredDataAdjustments?.forEach((adjustment) => {
      if (adjustment.action === "replace") {
        jsonEmbedding = {
          ...jsonEmbedding,
          ...{[adjustment.fieldName]: adjustment.value},
        }
      } else if (adjustment.action === "map") {
        jsonEmbedding = processStructuredDataMapping(adjustment, jsonEmbedding)
      }
    })
    return JSON.stringify(sort(jsonEmbedding), null, 2)
  }
  function processStructuredDataMapping(adjustment, jsonEmbedding) {
    const getFieldValue = (fieldName, object) => {
      if (object?.hasOwnProperty(fieldName)) {
        return object[fieldName]
      }
      return ""
    }
    const value = getFieldValue(adjustment.fieldName, jsonEmbedding)
    if (!value) {
      return jsonEmbedding
    }
    let newValue
    if (Array.isArray(value)) {
      newValue = value.map((v) => getValueFromRecord(adjustment.value, v))
    } else {
      newValue = getValueFromRecord(adjustment.value, value)
    }
    return {...jsonEmbedding, ...{[adjustment.fieldName]: newValue}}
  }
}
const TextSection = (props) => {
  const {t} = useTranslation(["translation", "language", "labelledConcept", "data"])
  const {label, text} = props
  return text ? (
    <>
      <Typography component="h2" color="textSecondary">
        {t(label)}
      </Typography>
      <Typography component="div" color="textPrimary" paragraph>
        {text}
      </Typography>
    </>
  ) : (
    ""
  )
}
const ButtonWrapper = (props) => {
  const {label} = props
  return (
    <Box m={1}>
      <Button variant="contained" {...props} size="large" color="primary">
        {label}
      </Button>
    </Box>
  )
}
const ResourceDetails = (props) => {
  const router = useRouter()
  const {resourceId} = router.query
  const {record, error} = props
  const theme = useTheme()
  const {t, i18n} = useTranslation(["translation", "language", "labelledConcept"], {
    bindI18n: "languageChanged loaded",
  })
  const oersiConfig = React.useContext(OersiConfigContext)
  const pageConfig = oersiConfig.detailPage
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  const baseFieldConfig = oersiConfig.fieldConfiguration?.baseFields
  const embedConfig = oersiConfig.fieldConfiguration?.embedding
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    record,
    fieldsOptions,
    t
  )
  const embeddingFieldValues = getEmbedValues(embedConfig, baseFieldValues, record)
  const [isInternalThumbnail, setIsInternalThumbnail] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
  )
  const getPreviewImageUrl = () => {
    if (!baseFieldValues.thumbnailUrl) {
      return null
    }
    return isInternalThumbnail
      ? getThumbnailUrl(resourceId)
      : baseFieldValues.thumbnailUrl
  }
  const thumbnailUrl = getPreviewImageUrl()
  const [embedDialogOpen, setEmbedDialogOpen] = React.useState(false)
  const handleClickEmbedDialogOpen = () => {
    setEmbedDialogOpen(true)
  }
  const handleEmbedDialogClose = (value) => {
    setEmbedDialogOpen(false)
  }
  const handleThumbnailFallback = (e) => {
    e.target.onerror = null
    setIsInternalThumbnail(false)
  }

  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["labelledConcept"])
  }, [])

  return (
    <Container>
      {(!record || error) && <ErrorInfo {...error} />}
      {record && !error && (
        <Card>
          <MetaTags
            record={record}
            resourceId={resourceId}
            baseFieldValues={baseFieldValues}
            siteName={t("HEADER.TITLE")}
          />
          <CardHeader
            title={
              <Typography
                variant="h5"
                component="h1"
                color="primary"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                <Link
                  target="_blank"
                  rel="noopener"
                  href={baseFieldValues.resourceLink}
                  color="inherit"
                  underline="hover"
                >
                  {baseFieldValues.title}
                </Link>
              </Typography>
            }
          />

          <CardContent>
            {(thumbnailUrl || isEmbeddable(embeddingFieldValues)) && (
              <Box pb={2}>
                {<LazyLoad>{getPreview()}</LazyLoad>}
                {getEmbedDialogComponents()}
              </Box>
            )}
            {pageConfig?.content?.map((e) => (
              <TextSection
                key={e.field}
                label={"data:fieldLabels." + e.field}
                text={getFieldValueView(e)}
              />
            ))}
          </CardContent>
          <CardActions style={{flexWrap: "wrap"}} disableSpacing>
            <ButtonWrapper
              target="_blank"
              rel="noopener"
              href={baseFieldValues.resourceLink}
              label={t("LABEL.TO_MATERIAL")}
            />
            <ButtonWrapper
              target="_blank"
              rel="noopener"
              href={
                process.env.NEXT_PUBLIC_PUBLIC_URL +
                "/" +
                resourceId +
                "?format=json"
              }
              startIcon={<JsonLinkedDataIcon />}
              label={t("LABEL.JSON")}
            />
            <ButtonWrapper
              startIcon={<ReportProblemIcon />}
              label={t("CONTACT.TOPIC_REPORT_RECORD")}
              onClick={() => {
                router.push({
                  pathname: "/services/contact",
                  query: {
                    reportRecordId: resourceId,
                    reportRecordName: baseFieldValues.title,
                  },
                })
              }}
            />
          </CardActions>
        </Card>
      )}
    </Container>
  )

  function getPreview() {
    return isEmbeddable(embeddingFieldValues) ? (
      <Typography component="h2" sx={getDefaultHtmlEmbeddingStyles()}>
        {parse(getHtmlEmbedding(embeddingFieldValues, t))}
        {oersiConfig.FEATURES?.OERSI_THUMBNAILS && (
          <img
            src={thumbnailUrl}
            style={{display: "None"}}
            onError={handleThumbnailFallback}
            alt="fallback workaround"
          />
        )}
      </Typography>
    ) : (
      <Box sx={{maxWidth: "560px", maxHeight: "315px"}}>
        <Link target="_blank" rel="noopener" href={baseFieldValues.resourceLink}>
          <CardMedia
            component="img"
            image={thumbnailUrl}
            style={{maxWidth: "560px", maxHeight: "315px"}}
            title={props.id}
            onError={handleThumbnailFallback}
            alt="preview image"
          />
        </Link>
      </Box>
    )
  }

  function getTypeConfig(componentConfig) {
    const idFct = (e) => e.length > 0 && e
    const typeConfigDefinition = {
      defaults: {
        fields: {field: componentConfig.field},
        view: (e) => e.field,
        join: (e) =>
          e?.length > 0 ? e.reduce((prev, curr) => [prev, ", ", curr]) : "",
      },
      chips: {
        view: getChipView,
        join: idFct,
      },
      date: {
        view: (e) => formatDate(e.field),
      },
      fileLink: {
        fields: {
          field: componentConfig.field,
          formatField: componentConfig.formatField,
          sizeField: componentConfig.sizeField,
        },
        view: getFileLinkView,
        join: (e) => e.length > 0 && <List>{e}</List>,
      },
      license: {
        view: getLicenseView,
        join: idFct,
      },
      link: {
        fields: {
          field: componentConfig.field,
          externalLinkField: componentConfig.externalLinkField,
        },
        view: getLinkView,
      },
      rating: {
        view: getRatingView,
      },
      text: {},
    }
    const typeConfig =
      typeConfigDefinition[componentConfig.type ? componentConfig.type : "text"]
    if (!typeConfig.fields) {
      typeConfig["fields"] = typeConfigDefinition.defaults.fields
    }
    if (!typeConfig.join) {
      typeConfig["join"] = typeConfigDefinition.defaults.join
    }
    if (!typeConfig.view) {
      typeConfig["view"] = typeConfigDefinition.defaults.view
    }
    return typeConfig
  }

  function getFieldValueView(componentConfig) {
    const fieldOptions = fieldsOptions?.find(
      (e) => e.dataField === componentConfig.field
    )
    const typeConfig = getTypeConfig(componentConfig)
    let fieldValues = getValuesFromRecord(typeConfig.fields, record)
      .filter((v) => v.field)
      .map((v) => {
        return {
          ...v,
          field: processFieldOption(v.field, fieldOptions, t),
        }
      })
    fieldValues = flattenFieldValues(fieldValues)
    return typeConfig.join(fieldValues.map((e) => typeConfig.view(e)))
  }

  function flattenFieldValues(fieldValues) {
    let result = []
    fieldValues.forEach((e) => {
      if (Array.isArray(e.field)) {
        result = [
          ...result,
          ...e.field.map((v) => {
            return {...e, field: v}
          }),
        ]
      } else {
        result = [...result, e]
      }
    })
    return result
  }

  function getRatingView(item) {
    return (
      <Box key={item.field} sx={{display: "inline-flex"}}>
        {item.field}
        <ThumbUp sx={{marginLeft: theme.spacing(0.5)}} />
      </Box>
    )
  }

  function getLinkView(item) {
    return (
      <Link
        key={item.field}
        target="_blank"
        rel="noopener"
        href={getSafeUrl(item.externalLinkField)}
        underline="hover"
      >
        {item.field}
      </Link>
    )
  }

  function getChipView(item) {
    return (
      <Chip
        key={item.field}
        sx={{margin: theme.spacing(0.5)}}
        label={<Typography color="textPrimary">{item.field}</Typography>}
      />
    )
  }

  function getLicenseView(item) {
    const licenseUrl = item.field
    if (licenseUrl) {
      const licenseGroup = getLicenseGroupById(licenseUrl)
      return !licenseGroup || hasLicenseIcon(licenseGroup.toLowerCase()) ? (
        <IconButton
          key={item.field}
          target="_blank"
          rel="license noreferrer"
          href={getSafeUrl(licenseUrl)}
          aria-label={licenseGroup}
          size="large"
        >
          {getLicenseIcon(licenseGroup.toLowerCase())}
        </IconButton>
      ) : (
        <Link
          key={item.field}
          target="_blank"
          rel="license noreferrer"
          href={getSafeUrl(licenseUrl)}
          aria-label={licenseGroup}
          underline="hover"
        >
          {licenseGroup}
        </Link>
      )
    }
    return ""
  }

  function getFileLinkView(item) {
    return (
      <ListItemButton key={item.field} href={item.field}>
        <ListItemText
          primary={item.field}
          secondary={getSecondaryEncodingText(item)}
        />
      </ListItemButton>
    )
  }

  function getEmbedDialogComponents() {
    return oersiConfig.FEATURES.EMBED_OER && isEmbeddable(embeddingFieldValues) ? (
      <>
        <Button
          color="grey"
          className="card-action-embed"
          onClick={handleClickEmbedDialogOpen}
          startIcon={<InputIcon />}
          key={"embed" + resourceId}
        >
          {t("EMBED_MATERIAL.EMBED")}
        </Button>
        <EmbedDialog
          open={embedDialogOpen}
          onClose={handleEmbedDialogClose}
          data={embeddingFieldValues}
        />
      </>
    ) : (
      ""
    )
  }

  function getSecondaryEncodingText(encoding) {
    return [encoding.formatField, encoding.sizeField ? encoding.sizeField + "B" : ""]
      .filter((e) => e)
      .join(", ")
  }
}

export default ResourceDetails
