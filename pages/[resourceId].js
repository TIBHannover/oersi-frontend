import React, {Component, useEffect, useState} from "react"
import Head from "next/head"
import {useRouter} from "next/router"
import initReactivesearch from "@appbaseio/reactivesearch/lib/server"
import parse from "html-react-parser"
import {sort} from "json-keys-sort"
import ReactiveSearchComponents from "../src/config/ReactiveSearchComponents"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import Configuration from "../src/Configuration"
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
import OersiConfigContext from "../src/helpers/OersiConfigContext"
import App from "../src/App"
import {getResource} from "../src/api/backend/resources"
import {
  getLicenseGroup,
  getSafeUrl,
  getThumbnailUrl,
  joinArrayField,
} from "../src/helpers/helpers"
import ErrorInfo from "../src/components/ErrorInfo"
import Header from "../src/components/Header"
import {useTranslation} from "next-i18next"
import {getHtmlEmbedding, isEmbeddable} from "../src/helpers/embed-helper"

export async function getServerSideProps(context) {
  const elasticSearchConfig = {
    app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
    url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
  }
  const rs_data = await initReactivesearch(
    [
      {
        ...ReactiveSearchComponents.datasearch,
      },
      {
        ...ReactiveSearchComponents.resultcard,
      },
    ],
    context.query,
    elasticSearchConfig
  )
  const translations = await serverSideTranslations(context.locale, [
    "translation",
    "language",
  ])
  if (!rs_data) {
    return {
      notFound: true,
    }
  }
  const rs_data_prep = JSON.parse(JSON.stringify(rs_data)) // workaround to make the data serializable
  const {resourceId} = context.query
  const resourceResponse = await getResource(resourceId)
    .then((responseJson) => {
      if (!responseJson || !responseJson.name || !getSafeUrl(responseJson.id)) {
        return {
          jsonRecord: responseJson,
          error: {
            statusCode: 500,
            statusText: "Invalid json record",
          },
        }
      }
      return {
        jsonRecord: responseJson,
        error: null,
      }
    })
    .catch((err) => {
      return {
        jsonRecord: null,
        error: {
          statusCode: err.statusCode,
          statusText: err.statusText,
        },
      }
    })

  return {
    props: {
      ...translations,
      reactiveSearchStore: rs_data_prep,
      record: resourceResponse.jsonRecord,
      error: resourceResponse.error,
    },
  }
}

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
  const thumbnailUrl = isOersiThumbnail ? getThumbnailUrl(resourceId) : record.image

  const handleThumbnailFallback = (e) => {
    e.target.onerror = null
    setIsOersiThumbnail(false)
  }

  return (
    <Container>
      {error && <ErrorInfo {...error} />}
      {!error && (
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

class DetailPage extends Component {
  render() {
    return (
      <div className="container">
        <Configuration initialReactiveSearchState={this.props.reactiveSearchStore}>
          <Header />
          <ResourceDetails record={this.props.record} error={this.props.error} />
        </Configuration>
      </div>
    )
  }
}

export default DetailPage
