import React, {useEffect, useState} from "react"
import {Helmet} from "react-helmet"
import {withTranslation} from "react-i18next"
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
  Link,
  Typography,
} from "@material-ui/core"
import {sort} from "json-keys-sort"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../ErrorInfo"
import {getResource} from "../../service/backend/resources"
import {formatDate, joinArrayField} from "../../helpers/helpers"
import {getLicenseLabel} from "../../helpers/embed-helper"
import {JsonLinkedDataIcon} from "../resultComponent/card/CustomIcons"

const MetaTags = (props) => {
  const {record, resourceId} = props
  return (
    <Helmet htmlAttributes={{prefix: "https://ogp.me/ns#"}}>
      <title>{record.name} - OERSI</title>
      {record.description && (
        <meta name="description" content={record.description} />
      )}

      <meta property="og:title" content={record.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={window.location.origin + process.env.PUBLIC_URL + "/" + resourceId}
      />
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
const TextSection = withTranslation(["translation", "language", "lrt", "subject"])(
  (props) => {
    const {label, text} = props
    return text ? (
      <Box mb={2}>
        <Typography variant="h6" component="h2">
          {props.t(label)}
        </Typography>
        <Typography variant="h5" component="p">
          {text}
        </Typography>
      </Box>
    ) : (
      ""
    )
  }
)
const ResourceDetails = (props) => {
  const resourceId = props.match.params.resourceId
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const [error, setError] = useState(null)

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
              <Typography variant="h3" component="h1">
                {record.name}
              </Typography>
            }
          />

          {record.image && (
            <Box p={2}>
              <LazyLoad>
                <CardMedia
                  component="img"
                  image={record.image}
                  style={{"max-width": "560px", "max-height": "315px"}}
                  title={props.id}
                />
              </LazyLoad>
            </Box>
          )}

          <CardContent>
            <TextSection label="LABEL.DESCRIPTION" text={record.description} />
            <TextSection label="LABEL.ABOUT" text={getAbout()} />
            <TextSection label="LABEL.RESOURCETYPE" text={getLrt()} />
            <TextSection label="LABEL.AUTHOR" text={getCreator()} />
            <TextSection label="LABEL.ORGANIZATION" text={getSourceOrganization()} />
            <TextSection label="LABEL.PUBLICATION_DATE" text={getDatePublished()} />
            <TextSection label="LABEL.LANGUAGE" text={getLanguage()} />
            <TextSection label="LABEL.KEYWORDS" text={getKeywords()} />
            <TextSection label="LABEL.LICENSE" text={getLicense()} />
            <TextSection label="LABEL.AUDIENCE" text={getAudience()} />
          </CardContent>
          <CardActions>
            <Box p={2}>
              <Button
                target="_blank"
                rel="noopener"
                href={process.env.PUBLIC_URL + "/" + resourceId + "?format=json"}
                aria-label="link to json-ld"
                startIcon={<JsonLinkedDataIcon />}
                size="large"
              >
                Json
              </Button>
            </Box>
          </CardActions>
        </Card>
      )}
    </Container>
  )

  function isValid(jsonRecord) {
    return jsonRecord && jsonRecord.name && jsonRecord.id
  }

  function getAbout() {
    return joinArrayField(
      record.about,
      (item) => item.id,
      (label) =>
        props.t("subject#" + label, {
          keySeparator: false,
          nsSeparator: "#",
        })
    )
  }

  function getLrt() {
    return joinArrayField(
      record.learningResourceType,
      (item) => item.id,
      (label) => props.t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
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
      (label) => props.t("language:" + label)
    )
  }

  function getKeywords() {
    return record.keywords ? (
      <>
        {record.keywords.map((item) => (
          <Chip className="m-1" label={item} />
        ))}
      </>
    ) : (
      ""
    )
  }

  function getLicense() {
    return record.license ? (
      <Link target="_blank" rel="noreferrer" href={record.license}>
        <div>{getLicenseLabel(record.license)}</div>
      </Link>
    ) : (
      ""
    )
  }

  function getAudience() {
    return joinArrayField(
      record.audience,
      (item) => item.id,
      (label) =>
        props.t("audience#" + label, {keySeparator: false, nsSeparator: "#"})
    )
  }
}

export default withTranslation([
  "translation",
  "audience",
  "language",
  "lrt",
  "subject",
])(ResourceDetails)
