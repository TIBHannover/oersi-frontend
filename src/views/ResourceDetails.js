import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {Helmet} from "react-helmet"
import {useTranslation} from "react-i18next"
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
  Paper,
} from "@mui/material"
import {
  Input as InputIcon,
  ReportProblem as ReportProblemIcon,
  ThumbUp,
} from "@mui/icons-material"
import {useNavigate, useParams} from "react-router-dom"
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
import {OersiConfigContext} from "../helpers/use-context"
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
    <Helmet htmlAttributes={{prefix: "og: https://ogp.me/ns#"}}>
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
    </Helmet>
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
function renderMultipleItems(list, multiItemsDisplayType, separator = ", ") {
  if (multiItemsDisplayType === "ul") {
    return (
      <ul>
        {list.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </ul>
    )
  }
  return list.reduce((prev, curr) => [prev, ", ", curr])
}
const TextSection = (props) => {
  const {t} = useTranslation(["translation", "language", "labelledConcept", "data"])
  const {label, children, paragraph = true} = props
  return (
    <>
      {children && (
        <>
          <Typography component="div" color="textSecondary">
            {t(label)}
          </Typography>
          <Typography component="div" color="textPrimary" paragraph={paragraph}>
            {children}
          </Typography>
        </>
      )}
    </>
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
const FieldContents = (props) => {
  const {contentConfigs, record, nestingLevel = 1} = props
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  const contentConfigsWithValues = addFieldValues(record, contentConfigs).filter(
    (e) => e.fieldValues?.length > 0
  )

  function addFieldValues(data, componentConfigs) {
    return componentConfigs?.map((componentConfig) => {
      const fieldOptions = fieldsOptions?.find(
        (e) => e.dataField === componentConfig.field
      )
      const typeFieldNameDefinition = {
        fileLink: {
          field: componentConfig.field,
          formatField: componentConfig.formatField,
          sizeField: componentConfig.sizeField,
        },
        link: {
          field: componentConfig.field,
          externalLinkField: componentConfig.externalLinkField,
        },
      }
      let componentFieldNames = componentConfig.type
        ? typeFieldNameDefinition[componentConfig.type]
        : null
      if (!componentFieldNames) {
        componentFieldNames = {field: componentConfig.field}
      }
      let fallBackFieldName =
        componentConfig.type === "link" ? "externalLinkField" : undefined
      let fieldValues = flattenFieldValues(
        getValuesFromRecord(componentFieldNames, data)
          .map((v) => {
            return {
              ...v,
              field: !v.field && fallBackFieldName ? v[fallBackFieldName] : v.field,
            }
          })
          .filter((v) => v.field)
          .map((v) => {
            return {
              ...v,
              field: processFieldOption(v.field, fieldOptions, t),
            }
          })
      )
      return {...componentConfig, fieldValues: fieldValues}
    })
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

  return (
    <>
      {contentConfigsWithValues?.map((e, index) => (
        <FieldContentDetails
          key={e.field}
          contentConfig={e}
          paragraph={index !== contentConfigsWithValues.length - 1}
          nestingLevel={nestingLevel}
        />
      ))}
    </>
  )
}

const FieldContentDetails = (props) => {
  const {contentConfig, paragraph = true, nestingLevel = 1} = props
  const oersiConfig = React.useContext(OersiConfigContext)
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  const componentType = contentConfig.type || "text"
  const labelKey = contentConfig.labelKey || contentConfig.field
  const multiItemsDisplayType = contentConfig.multiItemsDisplay

  return (
    <TextSection label={"data:fieldLabels." + labelKey} paragraph={paragraph}>
      {getFieldValueView()}
    </TextSection>
  )

  function getFieldValueView() {
    const fieldValues = contentConfig.fieldValues
    if (componentType === "chips") {
      return <ChipsView values={fieldValues} />
    } else if (componentType === "date") {
      return renderMultipleItems(
        fieldValues.map((e) => formatDate(e.field)),
        multiItemsDisplayType
      )
    } else if (componentType === "fileLink") {
      return <FileLinksView values={fieldValues} />
    } else if (componentType === "license") {
      const fieldOptions = fieldsOptions?.find(
        (e) => e.dataField === contentConfig.field
      )
      return (
        <LicensesView
          values={fieldValues}
          licenseGrouping={fieldOptions?.grouping}
        />
      )
    } else if (componentType === "link") {
      return (
        <LinksView
          values={fieldValues}
          multiItemsDisplayType={multiItemsDisplayType}
        />
      )
    } else if (componentType === "nestedObjects") {
      return (
        <NestedObjectsView
          values={fieldValues}
          nestingLevel={nestingLevel + 1}
          contentConfigs={contentConfig.content}
          parentLabelKey={labelKey}
        />
      )
    } else if (componentType === "rating") {
      return (
        <RatingsView
          values={fieldValues}
          multiItemsDisplayType={multiItemsDisplayType}
        />
      )
    }
    return renderMultipleItems(
      fieldValues.map((e) => e.field),
      multiItemsDisplayType
    )
  }
}
const FieldValueViewPropTypes = {
  values: PropTypes.array.isRequired,
}
const ChipsView = (props) => {
  const theme = useTheme()
  const {values} = props
  return values.map((e) => (
    <Chip
      key={e.field}
      sx={{margin: theme.spacing(0.5)}}
      label={<Typography color="textPrimary">{e.field}</Typography>}
    />
  ))
}
ChipsView.propTypes = {
  ...FieldValueViewPropTypes,
}
const FileLinksView = (props) => {
  const {values} = props
  return (
    <List>
      {values.map((e) => (
        <ListItemButton key={e.field} href={e.field}>
          <ListItemText primary={e.field} secondary={getSecondaryEncodingText(e)} />
        </ListItemButton>
      ))}
    </List>
  )
  function getSecondaryEncodingText(encoding) {
    return [encoding.formatField, encoding.sizeField ? encoding.sizeField + "B" : ""]
      .filter((e) => e)
      .join(", ")
  }
}
FileLinksView.propTypes = {
  ...FieldValueViewPropTypes,
}
const LicensesView = (props) => {
  const {values, licenseGrouping} = props
  return values.map((e) => {
    const licenseUrl = e.field
    const licenseGroup = getLicenseGroupById(licenseUrl, licenseGrouping)
    return !licenseGroup || hasLicenseIcon(licenseGroup.toLowerCase()) ? (
      <IconButton
        key={e.field}
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
        key={e.field}
        target="_blank"
        rel="license noreferrer"
        href={getSafeUrl(licenseUrl)}
        aria-label={licenseGroup}
        underline="hover"
      >
        {licenseGroup}
      </Link>
    )
  })
}
LicensesView.propTypes = {
  ...FieldValueViewPropTypes,
}
const LinksView = (props) => {
  const {values, multiItemsDisplayType} = props
  return renderMultipleItems(
    values.map((e) =>
      e.externalLinkField ? (
        <Link
          key={e.field}
          target="_blank"
          rel="noopener"
          href={getSafeUrl(e.externalLinkField)}
          underline="hover"
        >
          {e.field}
        </Link>
      ) : (
        e.field
      )
    ),
    multiItemsDisplayType
  )
}
LinksView.propTypes = {
  ...FieldValueViewPropTypes,
}
const NestedObjectsView = (props) => {
  const theme = useTheme()
  const {values, nestingLevel, contentConfigs, parentLabelKey} = props
  return values.map((e, index) => (
    <Paper
      key={index.toString()}
      elevation={nestingLevel}
      // variant="outlined"
      sx={{
        paddingX: theme.spacing(2),
        paddingY: theme.spacing(1),
        marginBottom: theme.spacing(index === values.length - 1 ? 0 : 1.5),
      }}
    >
      <FieldContents
        contentConfigs={contentConfigs.map((k) => {
          return {...k, labelKey: k.labelKey || parentLabelKey + "." + k.field}
        })}
        record={e.field}
        nestingLevel={nestingLevel}
      />
    </Paper>
  ))
}
NestedObjectsView.propTypes = {
  ...FieldValueViewPropTypes,
}
const RatingsView = (props) => {
  const theme = useTheme()
  const {values, multiItemsDisplayType} = props
  return renderMultipleItems(
    values.map((e) => (
      <Box key={e.field} sx={{display: "inline-flex"}}>
        {e.field}
        <ThumbUp sx={{marginLeft: theme.spacing(0.5)}} />
      </Box>
    )),
    multiItemsDisplayType
  )
}
RatingsView.propTypes = {
  ...FieldValueViewPropTypes,
}

const ResourceDetails = (props) => {
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const {resourceId} = useParams()
  const oersiConfig = React.useContext(OersiConfigContext)
  const pageConfig = oersiConfig.detailPage
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  const baseFieldConfig = oersiConfig.fieldConfiguration?.baseFields
  const embedConfig = oersiConfig.fieldConfiguration?.embedding
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    record,
    fieldsOptions,
    t
  )
  const embeddingFieldValues = getEmbedValues(embedConfig, baseFieldValues, record)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
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
    function isValid(jsonRecord) {
      const values = getBaseFieldValues(
        baseFieldConfig,
        jsonRecord,
        fieldsOptions,
        null
      )
      return values?.title && values?.resourceLink
    }

    const retrieveResource = async () => {
      setIsLoading(true)
      getResource(resourceId)
        .then((responseJson) => {
          if (!isValid(responseJson)) {
            throw new Error("Invalid record")
          }
          setRecord(responseJson)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError(err)
          setIsLoading(false)
        })
    }
    retrieveResource()
  }, [baseFieldConfig, fieldsOptions, resourceId])

  return (
    <Container>
      {isLoading && "Loading..."}
      {!isLoading && error && <ErrorInfo {...error} />}
      {!isLoading && !error && (
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
            <FieldContents contentConfigs={pageConfig?.content} record={record} />
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
              href={process.env.PUBLIC_URL + "/" + resourceId + "?format=json"}
              startIcon={<JsonLinkedDataIcon />}
              label={t("LABEL.JSON")}
            />
            <ButtonWrapper
              startIcon={<ReportProblemIcon />}
              label={t("CONTACT.TOPIC_REPORT_RECORD")}
              onClick={() => {
                navigate("/services/contact", {
                  state: {
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
}

export default ResourceDetails
