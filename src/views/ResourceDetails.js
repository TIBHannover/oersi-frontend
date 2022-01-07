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
  Typography,
  useTheme,
} from "@mui/material"
import {
  Input as InputIcon,
  ReportProblem as ReportProblemIcon,
} from "@mui/icons-material"
import {useHistory} from "react-router-dom"
import {sort} from "json-keys-sort"
import parse from "html-react-parser"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../components/ErrorInfo"
import {getResource} from "../api/backend/resources"
import {
  formatDate,
  getLicenseGroup,
  getSafeUrl,
  joinArrayField,
} from "../helpers/helpers"
import {getHtmlEmbedding, isEmbeddable} from "../helpers/embed-helper"
import {OersiConfigContext} from "../helpers/use-context"
import {getLicenseIcon, JsonLinkedDataIcon} from "../components/CustomIcons"
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

      <script type="application/ld+json">
        {JSON.stringify(sort(record), null, 2)}
      </script>
    </Helmet>
  )
}
const TextSection = (props) => {
  const {t} = useTranslation([
    "translation",
    "audience",
    "language",
    "lrt",
    "subject",
  ])
  const {label, text} = props
  return text ? (
    <>
      <Typography variant="h6" component="h2" color="textSecondary">
        {t(label)}
      </Typography>
      <Typography variant="h5" component="div" color="textPrimary" paragraph>
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
  const {t} = useTranslation([
    "translation",
    "audience",
    "language",
    "lrt",
    "subject",
  ])
  const resourceId = props.match.params.resourceId
  const oersiConfig = React.useContext(OersiConfigContext)
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const [error, setError] = useState(null)
  const history = useHistory()

  const [embedDialogOpen, setEmbedDialogOpen] = React.useState(false)
  const handleClickEmbedDialogOpen = () => {
    setEmbedDialogOpen(true)
  }
  const handleEmbedDialogClose = (value) => {
    setEmbedDialogOpen(false)
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
              <Typography variant="h3" component="h1" color="textPrimary">
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
                {record.image && <LazyLoad>{getPreview()}</LazyLoad>}
                {getEmbedDialogComponents()}
              </Box>
            )}
            <TextSection label="LABEL.AUTHOR" text={getCreator()} />
            <TextSection label="LABEL.DESCRIPTION" text={record.description} />
            <TextSection label="LABEL.ABOUT" text={getAbout()} />
            <TextSection label="LABEL.RESOURCETYPE" text={getLrt()} />
            <TextSection label="LABEL.ORGANIZATION" text={getSourceOrganization()} />
            <TextSection label="LABEL.PUBLICATION_DATE" text={getDatePublished()} />
            <TextSection label="LABEL.LANGUAGE" text={getLanguage()} />
            <TextSection label="LABEL.KEYWORDS" text={getKeywords()} />
            <TextSection label="LABEL.LICENSE" text={getLicense()} />
            <TextSection label="LABEL.AUDIENCE" text={getAudience()} />
            <TextSection label="LABEL.PROVIDER" text={getProvider()} />
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
                history.push({
                  pathname: "/services/contact",
                  state: {reportRecordId: resourceId, reportRecordName: record.name},
                })
              }}
            />
          </CardActions>
        </Card>
      )}
    </Container>
  )

  function isValid(jsonRecord) {
    return jsonRecord && jsonRecord.name && getSafeUrl(jsonRecord.id)
  }

  function getPreview() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
      <Typography variant="h6" component="h2">
        {parse(getHtmlEmbedding({...record, licenseGroup: licenseGroup}, t))}
      </Typography>
    ) : (
      <CardMedia
        component="img"
        image={record.image}
        style={{"max-width": "560px", "max-height": "315px"}}
        title={props.id}
        alt="preview image"
      />
    )
  }

  function getAbout() {
    return joinArrayField(
      record.about,
      (item) => item.id,
      (label) =>
        t("subject#" + label, {
          keySeparator: false,
          nsSeparator: "#",
        })
    )
  }

  function getLrt() {
    return joinArrayField(
      record.learningResourceType,
      (item) => item.id,
      (label) => t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
    )
  }

  function getCreator() {
    return joinArrayField(record.creator, (item) => item.name)
  }

  function getSourceOrganization() {
    return joinArrayField(record.sourceOrganization, (item) => item.name)
  }

  function getDatePublished() {
    return record.datePublished ? formatDate(record.datePublished, "ll") : ""
  }

  function getLanguage() {
    return joinArrayField(
      record.inLanguage,
      (item) => item,
      (label) => t("language:" + label)
    )
  }

  function getKeywords() {
    return record.keywords ? (
      <>
        {record.keywords.map((item) => (
          <Chip
            key={item + resourceId}
            sx={{margin: theme.spacing(0.5)}}
            label={<Typography color="textPrimary">{item}</Typography>}
          />
        ))}
      </>
    ) : (
      ""
    )
  }

  function getLicense() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return record.license && record.license.id ? (
      <IconButton
        target="_blank"
        rel="license noreferrer"
        href={getSafeUrl(record.license.id)}
        aria-label={licenseGroup}
        size="large"
      >
        {getLicenseIcon(licenseGroup)}
      </IconButton>
    ) : (
      ""
    )
  }

  function getAudience() {
    return joinArrayField(
      record.audience,
      (item) => item.id,
      (label) => t("audience#" + label, {keySeparator: false, nsSeparator: "#"})
    )
  }

  function getProvider() {
    return record.mainEntityOfPage
      ? record.mainEntityOfPage
          .filter((e) => e.provider && e.provider.name)
          .map((item) => (
            <Link
              target="_blank"
              rel="noopener"
              href={getSafeUrl(item.id)}
              key={item.provider.name + resourceId}
              underline="hover"
            >
              {item.provider.name}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ", ", curr])
      : ""
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
}

export default ResourceDetails
