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
  IconButton,
  Link,
  Typography,
} from "@material-ui/core"
import InputIcon from "@material-ui/icons/Input"
import {sort} from "json-keys-sort"
import parse from "html-react-parser"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../ErrorInfo"
import {getResource} from "../../service/backend/resources"
import {formatDate, getLicenseGroup, joinArrayField} from "../../helpers/helpers"
import {getHtmlEmbedding, isEmbeddable} from "../../helpers/embed-helper"
import {ConfigurationRunTime} from "../../helpers/use-context"
import {getLicenseIcon, JsonLinkedDataIcon} from "../CustomIcons"
import EmbedDialog from "../resultComponent/EmbedDialog"

const MetaTags = (props) => {
  const {record, resourceId} = props
  const context = React.useContext(ConfigurationRunTime)
  const canonicalUrl = context.PUBLIC_URL + "/" + resourceId
  return (
    <Helmet htmlAttributes={{prefix: "https://ogp.me/ns#"}}>
      <title>{record.name} - OERSI</title>
      {record.description && (
        <meta name="description" content={record.description} />
      )}
      <link rel="canonical" href={canonicalUrl} />

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
const TextSection = withTranslation(["translation", "language", "lrt", "subject"])(
  (props) => {
    const {label, text} = props
    return text ? (
      <>
        <Typography variant="h6" component="h2" color="textSecondary">
          {props.t(label)}
        </Typography>
        <Typography variant="h5" component="div" color="textPrimary" paragraph>
          {text}
        </Typography>
      </>
    ) : (
      ""
    )
  }
)
const ButtonWrapper = (props) => {
  const {label} = props
  return (
    <Box m={1}>
      <Button variant="outlined" {...props} size="large">
        {label}
      </Button>
    </Box>
  )
}
const ResourceDetails = (props) => {
  const resourceId = props.match.params.resourceId
  const context = React.useContext(ConfigurationRunTime)
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const [error, setError] = useState(null)

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
                  href={record.id}
                  color="inherit"
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
              href={record.id}
              aria-label="link to material"
              label={props.t("LABEL.TO_MATERIAL")}
            />
            <ButtonWrapper
              target="_blank"
              rel="noopener"
              href={process.env.PUBLIC_URL + "/" + resourceId + "?format=json"}
              aria-label="link to json-ld"
              startIcon={<JsonLinkedDataIcon />}
              label={props.t("LABEL.JSON")}
            />
          </CardActions>
        </Card>
      )}
    </Container>
  )

  function isValid(jsonRecord) {
    return jsonRecord && jsonRecord.name && jsonRecord.id
  }

  function getPreview() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
      parse(
        getHtmlEmbedding(
          {...record, licenseGroup: licenseGroup},
          props.t,
          context.EMBED_MEDIA_MAPPING
        )
      )
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
          <Chip
            key={item + resourceId}
            className="m-1"
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
    return record.license ? (
      <IconButton
        target="_blank"
        rel="noreferrer"
        href={record.license}
        aria-label="link to license"
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
      (label) =>
        props.t("audience#" + label, {keySeparator: false, nsSeparator: "#"})
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
              href={item.id}
              key={item.provider.name + resourceId}
            >
              {item.provider.name}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ", ", curr])
      : ""
  }

  function getEmbedDialogComponents() {
    const licenseGroup = getLicenseGroup(record.license).toLowerCase()
    return context.FEATURES.EMBED_OER &&
      isEmbeddable({...record, licenseGroup: licenseGroup}) ? (
      <>
        <Button
          className="card-action-embed"
          onClick={handleClickEmbedDialogOpen}
          startIcon={<InputIcon />}
          key={"embed" + resourceId}
        >
          {props.t("EMBED_MATERIAL.EMBED")}
        </Button>
        <EmbedDialog
          open={embedDialogOpen}
          onClose={handleEmbedDialogClose}
          data={{...record, licenseGroup: licenseGroup}}
          mediaMapping={context.EMBED_MEDIA_MAPPING}
        />
      </>
    ) : (
      ""
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
