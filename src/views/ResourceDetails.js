import React, {useState} from "react"
import Head from "next/head"
import {sort} from "json-keys-sort"
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
  Typography,
  useTheme,
} from "@mui/material"
import {
  Input as InputIcon,
  ReportProblem as ReportProblemIcon,
} from "@mui/icons-material"
import {useRouter} from "next/router"
import parse from "html-react-parser"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../components/ErrorInfo"
import {
  getHtmlEmbedding,
  isEmbeddable,
  getDefaultHtmlEmbeddingStyles,
} from "../helpers/embed-helper"
import OersiConfigContext from "../helpers/OersiConfigContext"
import {
  getLicenseIcon,
  hasLicenseIcon,
  JsonLinkedDataIcon,
} from "../components/CustomIcons"
import {
  formatDate,
  getLicenseGroup,
  getSafeUrl,
  getThumbnailUrl,
  joinArrayField,
} from "../helpers/helpers"
import EmbedDialog from "../components/EmbedDialog"

const MetaTags = (props) => {
  const {record, resourceId} = props
  const oersiConfig = React.useContext(OersiConfigContext)
  const canonicalUrl = oersiConfig.PUBLIC_URL + "/" + resourceId
  const encodedUrl = encodeURIComponent(canonicalUrl)
  return (
    <Head htmlAttributes={{prefix: "https://ogp.me/ns#"}}>
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
    </Head>
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
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
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
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const oersiConfig = React.useContext(OersiConfigContext)
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

  return (
    <Container>
      {(!record || error) && <ErrorInfo {...error} />}
      {record && !error && (
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
            <TextSection label="LABEL.AUTHOR" text={getCreator()} />
            <TextSection label="LABEL.DESCRIPTION" text={record.description} />
            <TextSection label="LABEL.ABOUT" text={getLabelledConcept("about")} />
            <TextSection
              label="LABEL.RESOURCETYPE"
              text={getLabelledConcept("learningResourceType")}
            />
            <TextSection label="LABEL.ORGANIZATION" text={getSourceOrganization()} />
            <TextSection label="LABEL.PUBLICATION_DATE" text={getDatePublished()} />
            <TextSection label="LABEL.LANGUAGE" text={getLanguage()} />
            <TextSection label="LABEL.KEYWORDS" text={getKeywords()} />
            <TextSection label="LABEL.LICENSE" text={getLicense()} />
            <TextSection
              label="LABEL.AUDIENCE"
              text={getLabelledConcept("audience")}
            />
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

  function getLabelledConcept(fieldName) {
    return joinArrayField(
      record[fieldName],
      (item) => item.id,
      (label) =>
        t("labelledConcept#" + label, {keySeparator: false, nsSeparator: "#"})
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
    if (record.license && record.license.id) {
      const licenseGroup = getLicenseGroup(record.license)
      return !licenseGroup || hasLicenseIcon(licenseGroup.toLowerCase()) ? (
        <IconButton
          target="_blank"
          rel="license noreferrer"
          href={getSafeUrl(record.license.id)}
          aria-label={licenseGroup}
          size="large"
        >
          {getLicenseIcon(licenseGroup.toLowerCase())}
        </IconButton>
      ) : (
        <Link
          target="_blank"
          rel="license noreferrer"
          href={getSafeUrl(record.license.id)}
          aria-label={licenseGroup}
          underline="hover"
        >
          {licenseGroup}
        </Link>
      )
    }
    return ""
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
