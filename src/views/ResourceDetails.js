import React, {useState} from "react"
import OersiConfigContext from "../helpers/OersiConfigContext"
import Head from "next/head"
import {
  getLicenseGroup,
  getSafeUrl,
  getThumbnailUrl,
  joinArrayField,
} from "../helpers/helpers"
import {sort} from "json-keys-sort"
import {useTranslation} from "next-i18next"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Link,
  Typography,
  useTheme,
} from "@mui/material"
import {useRouter} from "next/router"
import ErrorInfo from "../components/ErrorInfo"
import {getHtmlEmbedding, isEmbeddable} from "../helpers/embed-helper"
import parse from "html-react-parser"

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
const ResourceDetails = (props) => {
  const router = useRouter()
  const {resourceId} = router.query
  const {record, error} = props
  const theme = useTheme()
  const {t} = useTranslation([
    "translation",
    "audience",
    "language",
    "lrt",
    "subject",
  ])
  const oersiConfig = React.useContext(OersiConfigContext)
  const [isOersiThumbnail, setIsOersiThumbnail] = useState(
    oersiConfig.FEATURES?.OERSI_THUMBNAILS
  )
  const thumbnailUrl = isOersiThumbnail ? getThumbnailUrl(resourceId) : record?.image

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
                {thumbnailUrl && getPreview()}
                {/*{getEmbedDialogComponents()}*/}
              </Box>
            )}
            <TextSection label="LABEL.AUTHOR" text={getCreator()} />
            <TextSection label="LABEL.DESCRIPTION" text={record.description} />
            {/*<TextSection label="LABEL.ABOUT" text={getAbout()} />*/}
            {/*<TextSection label="LABEL.RESOURCETYPE" text={getLrt()} />*/}
            {/*<TextSection label="LABEL.ORGANIZATION" text={getSourceOrganization()} />*/}
            {/*<TextSection label="LABEL.PUBLICATION_DATE" text={getDatePublished()} />*/}
            {/*<TextSection label="LABEL.LANGUAGE" text={getLanguage()} />*/}
            {/*<TextSection label="LABEL.KEYWORDS" text={getKeywords()} />*/}
            {/*<TextSection label="LABEL.LICENSE" text={getLicense()} />*/}
            {/*<TextSection label="LABEL.AUDIENCE" text={getAudience()} />*/}
            {/*<TextSection label="LABEL.PROVIDER" text={getProvider()} />*/}
          </CardContent>
        </Card>
      )}
    </Container>
  )

  function getPreview() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
      <Typography variant="h6" component="h2">
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
      <CardMedia
        component="img"
        image={thumbnailUrl}
        style={{maxWidth: "560px", maxHeight: "315px"}}
        title={props.id}
        onError={handleThumbnailFallback}
        alt="preview image"
      />
    )
  }

  function getCreator() {
    return joinArrayField(record.creator, (item) => item.name)
  }
}

export default ResourceDetails
