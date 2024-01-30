import React, {useEffect, useState} from "react"
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
  getLicenseGroup,
  getLicenseGroupById,
  getSafeUrl,
  getThumbnailUrl,
  getValuesFromRecord,
  joinArrayField,
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
  const {record, resourceId} = props
  const oersiConfig = React.useContext(OersiConfigContext)
  const canonicalUrl = oersiConfig.PUBLIC_URL + "/" + resourceId
  const encodedUrl = encodeURIComponent(canonicalUrl)
  return (
    <Helmet htmlAttributes={{prefix: "https://ogp.me/ns#"}}>
      <title>{record.name} - OERSI</title>
      {record.description && (
        <meta name="description" content={record.description} />
      )}
      {record.creator && (
        <meta
          name="author"
          content={joinArrayField(record.creator, (item) => item.name, null)}
        />
      )}
      {record.keywords && (
        <meta
          name="keywords"
          content={joinArrayField(record.keywords, (item) => item, null)}
        />
      )}
      <link rel="canonical" href={canonicalUrl} />
      {record.license && getSafeUrl(record.license.id) && (
        <link rel="license" href={getSafeUrl(record.license.id)} />
      )}
      <link
        rel="alternate"
        type="application/json+oembed"
        href={oersiConfig.PUBLIC_URL + "/api/oembed-json?url=" + encodedUrl}
        title={record.name}
      />
      <link
        rel="alternate"
        type="text/xml+oembed"
        href={oersiConfig.PUBLIC_URL + "/api/oembed-xml?url=" + encodedUrl}
        title={record.name}
      />

      <meta property="og:title" content={record.name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="OERSI" />
      {record.description && (
        <meta property="og:description" content={record.description} />
      )}
      {record.image && <meta property="og:image" content={record.image} />}

      <meta name="twitter:card" content="summary" />

      <script type="application/ld+json">{getJsonEmbedding()}</script>
    </Helmet>
  )

  function getJsonEmbedding() {
    const json = {
      ...record,
      "@context": [
        {
          "@vocab": "https://schema.org/",
          id: "@id",
          type: "@type",
          skos: "http://www.w3.org/2004/02/skos/core#",
          prefLabel: {
            "@id": "skos:prefLabel",
            "@container": "@language",
          },
          inScheme: "skos:inScheme",
          Concept: "skos:Concept",
        },
        ...(record["@context"] ? record["@context"] : []),
      ],
    }
    return JSON.stringify(sort(json), null, 2)
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
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const {resourceId} = useParams()
  const oersiConfig = React.useContext(OersiConfigContext)
  const pageConfig = oersiConfig.DETAIL_PAGE
  const fieldsConfig = oersiConfig.FIELDS
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [isOersiThumbnail, setIsOersiThumbnail] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
  )
  const thumbnailUrl = isOersiThumbnail ? getThumbnailUrl(resourceId) : record.image
  const [embedDialogOpen, setEmbedDialogOpen] = React.useState(false)
  const handleClickEmbedDialogOpen = () => {
    setEmbedDialogOpen(true)
  }
  const handleEmbedDialogClose = (value) => {
    setEmbedDialogOpen(false)
  }
  const handleThumbnailFallback = (e) => {
    e.target.onerror = null
    setIsOersiThumbnail(false)
  }

  useEffect(() => {
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
  }, [resourceId])

  return (
    <Container>
      {isLoading && "Loading..."}
      {!isLoading && error && <ErrorInfo {...error} />}
      {!isLoading && !error && (
        <Card>
          <MetaTags record={record} resourceId={resourceId} />
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
                  href={getSafeUrl(record.id)}
                  color="inherit"
                  underline="hover"
                >
                  {record.name}
                </Link>
              </Typography>
            }
          />

          <CardContent>
            {(record.image ||
              isEmbeddable({
                ...record,
                licenseGroup: getLicenseGroup(record.license).toLowerCase(),
              })) && (
              <Box pb={2}>
                {thumbnailUrl && <LazyLoad>{getPreview()}</LazyLoad>}
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
              href={getSafeUrl(record.id)}
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
                    reportRecordName: record.name,
                  },
                })
              }}
            />
          </CardActions>
        </Card>
      )}
    </Container>
  )

  function isValid(jsonRecord) {
    return jsonRecord?.name && getSafeUrl(jsonRecord.id)
  }

  function getPreview() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
      <Typography component="h2" sx={getDefaultHtmlEmbeddingStyles()}>
        {parse(
          getHtmlEmbedding(
            {...record, licenseGroup: licenseGroup, image: thumbnailUrl},
            t
          )
        )}
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
        <Link target="_blank" rel="noopener" href={getSafeUrl(record.id)}>
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
        view: (e) => formatDate(e.field, "ll"),
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
      text: {}
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
    const fieldConfig = fieldsConfig.find(
      (e) => e.dataField === componentConfig.field
    )
    const typeConfig = getTypeConfig(componentConfig)
    let fieldValues = getValuesFromRecord(typeConfig.fields, record).filter(
      (v) => v.field
    )
    if (fieldConfig?.translationNamespace) {
      fieldValues = fieldValues.map((v) => {
        return {
          ...v,
          field: t(fieldConfig?.translationNamespace + "#" + v.field, {
            keySeparator: false,
            nsSeparator: "#",
          }),
        }
      })
    }
    return typeConfig.join(fieldValues.map((e) => typeConfig.view(e)))
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
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return oersiConfig.FEATURES.EMBED_OER &&
      isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
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
          data={{...record, licenseGroup: licenseGroup}}
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
