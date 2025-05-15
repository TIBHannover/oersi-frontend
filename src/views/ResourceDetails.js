import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {Helmet} from "react-helmet"
import {useTranslation} from "react-i18next"
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Stack from "react-bootstrap/Stack"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import {useNavigate, useParams} from "react-router"
import {sort} from "json-keys-sort"
import parse from "html-react-parser"
import LazyLoad from "react-lazyload"
import ErrorInfo from "../components/ErrorInfo"
import {getResource} from "../api/backend/resources"
import {
  concatPaths,
  formatDate,
  getBaseFieldValues,
  getEmbedValues,
  getLicenseGroupById,
  getSafeUrl,
  getValuesFromRecord,
  processFieldOption,
  processStructuredDataAdjustments,
  useInternalThumbnailUrl,
} from "../helpers/helpers"
import {getHtmlEmbedding, isEmbeddable} from "../helpers/embed-helper"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import BoxArrowInRightIcon from "../components/icons/BoxArrowInRightIcon"
import ExclamationTriangleIcon from "../components/icons/ExclamationTriangleIcon"
import {
  getLicenseIcon,
  hasLicenseIcon,
} from "../components/icons/CreativeCommonsIcons"
import JsonLinkedDataIcon from "../components/icons/JsonLinkedDataIcon"
import ThumbsUpIcon from "../components/icons/ThumbsUpIcon"
import EmbedDialog from "../components/EmbedDialog"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const MetaTags = (props) => {
  const {baseFieldValues, record, resourceId, siteName} = props
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const canonicalUrl = concatPaths(
    concatPaths(frontendConfig.PUBLIC_URL, frontendConfig.routes.DETAILS_BASE),
    resourceId
  )
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
        href={frontendConfig.PUBLIC_URL + "/api/oembed-json?url=" + encodedUrl}
        title={baseFieldValues.title}
      />
      <link
        rel="alternate"
        type="text/xml+oembed"
        href={frontendConfig.PUBLIC_URL + "/api/oembed-xml?url=" + encodedUrl}
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
    let jsonEmbedding = processStructuredDataAdjustments(
      record,
      frontendConfig.embeddedStructuredDataAdjustments
    )
    return JSON.stringify(sort(jsonEmbedding), null, 2)
  }
}
function renderMultipleItems(list, multiItemsDisplayType, separator = ", ") {
  if (!list || list.length === 0) {
    return ""
  } else if (multiItemsDisplayType === "ul") {
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
  const {label, children, paragraph = true, showLabel = true} = props
  return (
    <>
      {showLabel && <div className="text-body-tertiary fw-bold">{t(label)}</div>}
      <div
        className={
          (children ? "text-body" : "text-body-secondary") +
          (paragraph ? " mb-3" : "")
        }
      >
        {children || <div className="fst-italic">{t("LABEL.N/A")}</div>}
      </div>
    </>
  )
}
const ButtonWrapper = (props) => {
  const {label, startIcon} = props
  return (
    <Button
      className="d-inline-flex"
      href={props.href}
      rel={props.rel}
      target={props.target}
      onClick={props.onClick}
    >
      <>
        {startIcon ? (
          <span className="button-icon d-flex align-items-center pe-1">
            {startIcon}
          </span>
        ) : (
          ""
        )}
        {label}
      </>
    </Button>
  )
}
const FieldContents = (props) => {
  const {contentConfigs, record, hideTextLabels = false, showNoteNA = false} = props
  const {i18n} = useTranslation(["translation", "language", "labelledConcept"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  const contentConfigsWithValues = addFieldValues(record, contentConfigs).filter(
    (e) => {
      if (e.type === "group") {
        return addFieldValues(record, e.content).some(
          (h) => h.fieldValues?.length > 0
        )
      }
      return showNoteNA || e.fieldValues?.length > 0
    }
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
      let fieldValues
      if (["group", "tabs"].indexOf(componentConfig.type) > -1) {
        fieldValues = [record]
      } else {
        fieldValues = flattenFieldValues(
          getValuesFromRecord(componentFieldNames, data)
            .map((v) => {
              return {
                ...v,
                field:
                  !v.field && fallBackFieldName ? v[fallBackFieldName] : v.field,
              }
            })
            .filter((v) => v.field)
            .map((v) => {
              return {
                ...v,
                field: processFieldOption(v.field, fieldOptions, i18n),
              }
            })
        )
      }
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
    <Row>
      {contentConfigsWithValues?.map((e, index) => (
        <Col
          key={e.field}
          xs={e.weight ? e.weight * 6 : 12}
          lg={e.weight ? e.weight * 4 : 12}
        >
          <FieldContentDetails
            contentConfig={e}
            paragraph={index !== contentConfigsWithValues.length - 1}
            hideTextLabel={["group", "tabs"].indexOf(e.type) > -1 || hideTextLabels}
          />
        </Col>
      ))}
    </Row>
  )
}

const FieldContentDetails = (props) => {
  const {contentConfig, paragraph = true, hideTextLabel = false} = props
  const {i18n} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  const componentType = contentConfig.type || "text"
  const labelKey = contentConfig.labelKey || contentConfig.field
  const multiItemsDisplayType = contentConfig.multiItemsDisplay

  return (
    <TextSection
      label={"data:fieldLabels." + labelKey}
      paragraph={paragraph}
      showLabel={!hideTextLabel}
    >
      {getFieldValueView()}
    </TextSection>
  )

  function getFieldValueView() {
    const fieldValues = contentConfig.fieldValues
    if (componentType === "chips") {
      return <ChipsView values={fieldValues} />
    } else if (componentType === "date") {
      return renderMultipleItems(
        fieldValues.map((e) => formatDate(e.field, i18n.resolvedLanguage)),
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
          collectOthersInSeparateGroup={fieldOptions?.collectOthersInSeparateGroup}
        />
      )
    } else if (componentType === "group") {
      return (
        <FieldContents
          contentConfigs={contentConfig.content}
          record={fieldValues[0]}
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
    } else if (componentType === "tabs") {
      return (
        <TabsView record={fieldValues[0]} contentConfigs={contentConfig.content} />
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
  const {values} = props
  return (
    <Stack direction="horizontal" gap={1} className="flex-wrap fs-5">
      {values.map((e) => (
        <Badge key={e.field} pill={true} bg="secondary" className="fw-normal">
          {e.field}
        </Badge>
      ))}
    </Stack>
  )
}
ChipsView.propTypes = {
  ...FieldValueViewPropTypes,
}
const FileLinksView = (props) => {
  const {values} = props
  return (
    <ListGroup variant="flush">
      {values.map((e) => (
        <ListGroup.Item key={e.field} action href={e.field}>
          <div className="me-auto">
            <div>{e.field}</div>
            <small className="text-body-secondary">
              {getSecondaryEncodingText(e)}
            </small>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
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
  const {values, licenseGrouping, collectOthersInSeparateGroup} = props
  return values.map((e) => {
    const licenseUrl = e.field
    let licenseGroup = getLicenseGroupById(
      licenseUrl,
      licenseGrouping,
      collectOthersInSeparateGroup
    )
    if (collectOthersInSeparateGroup && licenseGroup === "OTHER") {
      licenseGroup = licenseUrl
    }
    return licenseGroup && hasLicenseIcon(licenseGroup.toLowerCase()) ? (
      <Button
        key={e.field}
        variant="custom"
        target="_blank"
        rel="license noreferrer"
        href={getSafeUrl(licenseUrl)}
        aria-label={licenseGroup}
      >
        {getLicenseIcon(licenseGroup.toLowerCase())}
      </Button>
    ) : (
      <a
        key={e.field}
        target="_blank"
        rel="license noreferrer"
        href={getSafeUrl(licenseUrl)}
        aria-label={licenseGroup || licenseUrl}
      >
        {licenseGroup || licenseUrl}
      </a>
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
        <a
          key={e.field}
          target="_blank"
          rel="noreferrer"
          href={getSafeUrl(e.externalLinkField)}
        >
          {e.field}
        </a>
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
  const {values, contentConfigs, parentLabelKey} = props
  return (
    <ListGroup>
      {values.map((e, index) => (
        <ListGroup.Item key={index.toString()}>
          <FieldContents
            contentConfigs={contentConfigs.map((k) => {
              return {...k, labelKey: k.labelKey || parentLabelKey + "." + k.field}
            })}
            record={e.field}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
NestedObjectsView.propTypes = {
  ...FieldValueViewPropTypes,
}
const RatingsView = (props) => {
  const {values, multiItemsDisplayType} = props
  return renderMultipleItems(
    values.map((e) => (
      <Stack key={e.field} gap={1} direction="horizontal">
        {e.field}
        <ThumbsUpIcon />
      </Stack>
    )),
    multiItemsDisplayType
  )
}
RatingsView.propTypes = {
  ...FieldValueViewPropTypes,
}
const TabsView = (props) => {
  const {record, contentConfigs} = props
  const {t} = useTranslation(["data"])

  return (
    <Tabs aria-label={"alternative values"}>
      {contentConfigs.map((e, index) => (
        <Tab
          key={e.field}
          eventKey={e.field}
          title={t("data:fieldLabels." + (e.labelKey || e.field))}
          id={`simple-tab-${index}`}
          aria-controls={`simple-tabpanel-${index}`}
        >
          <div className="p-3">
            <FieldContents
              contentConfigs={[e]}
              record={record}
              hideTextLabels={true}
              showNoteNA={true}
            />
          </div>
        </Tab>
      ))}
    </Tabs>
  )
}

const ResourceDetails = (props) => {
  const {t, i18n} = useTranslation(["translation", "language", "labelledConcept"])
  const {resourceId} = useParams()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const pageConfig = frontendConfig.detailPage
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  const baseFieldConfig = frontendConfig.fieldConfiguration?.baseFields
  const embedConfig = frontendConfig.fieldConfiguration?.embedding
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    record,
    fieldsOptions,
    i18n
  )
  const embeddingFieldValues = getEmbedValues(embedConfig, baseFieldValues, record)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const internalThumbnailUrl = useInternalThumbnailUrl(resourceId)
  const [isInternalThumbnail, setIsInternalThumbnail] = useState(
    frontendConfig.FEATURES?.SIDRE_THUMBNAILS
  )
  const getPreviewImageUrl = () => {
    if (!baseFieldValues.thumbnailUrl) {
      return null
    }
    return isInternalThumbnail ? internalThumbnailUrl : baseFieldValues.thumbnailUrl
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
        i18n
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
  }, [baseFieldConfig, fieldsOptions, i18n, resourceId])

  return (
    <div className="container my-3">
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
          <Card.Body>
            <Card.Title>
              <h1 className="h5 fw-bold">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={baseFieldValues.resourceLink}
                >
                  {baseFieldValues.title}
                </a>
              </h1>
            </Card.Title>
            <Card.Text as="div">
              {(thumbnailUrl || isEmbeddable(embeddingFieldValues)) && (
                <div className="pb-3">
                  {<LazyLoad>{getPreview()}</LazyLoad>}
                  {getEmbedDialogComponents()}
                </div>
              )}
              <FieldContents contentConfigs={pageConfig?.content} record={record} />
            </Card.Text>
          </Card.Body>

          <Card.Body>
            <Stack direction="horizontal" gap={3}>
              <ButtonWrapper
                target="_blank"
                rel="noopener"
                href={baseFieldValues.resourceLink}
                label={t("LABEL.TO_MATERIAL")}
              />
              <ButtonWrapper
                target="_blank"
                rel="noopener"
                href={concatPaths(
                  frontendConfig.PUBLIC_BASE_PATH,
                  concatPaths(
                    frontendConfig.routes.DETAILS_BASE,
                    "/" + resourceId + "?format=json"
                  )
                )}
                startIcon={<JsonLinkedDataIcon />}
                label={t("LABEL.JSON")}
              />
              <ButtonWrapper
                onClick={() => {
                  navigate(frontendConfig.routes.CONTACT, {
                    state: {
                      reportRecordId: resourceId,
                      reportRecordName: baseFieldValues.title,
                    },
                  })
                }}
                startIcon={<ExclamationTriangleIcon width="1em" height="1em" />}
                label={t("CONTACT.TOPIC_REPORT_RECORD")}
              />
            </Stack>
          </Card.Body>
        </Card>
      )}
    </div>
  )

  function getPreview() {
    return (
      <div className="mt-3">
        {isEmbeddable(embeddingFieldValues) ? (
          <>
            {parse(getHtmlEmbedding(embeddingFieldValues, t))}
            {frontendConfig.FEATURES?.SIDRE_THUMBNAILS && (
              <img
                src={thumbnailUrl}
                style={{display: "None"}}
                onError={handleThumbnailFallback}
                alt="fallback workaround"
              />
            )}
          </>
        ) : (
          <a target="_blank" rel="noreferrer" href={baseFieldValues.resourceLink}>
            <img
              className="object-fit-cover"
              src={thumbnailUrl}
              style={{maxWidth: "560px", maxHeight: "315px", width: "100%"}}
              title={props.id}
              onError={handleThumbnailFallback}
              alt="resource preview"
            />
          </a>
        )}
      </div>
    )
  }

  function getEmbedDialogComponents() {
    return frontendConfig.FEATURES.RESOURCE_EMBEDDING_SNIPPET &&
      isEmbeddable(embeddingFieldValues) ? (
      <>
        <Button
          variant="secondary"
          className="card-action-embed"
          onClick={handleClickEmbedDialogOpen}
        >
          <span className="button-icon pe-1">
            <BoxArrowInRightIcon />
          </span>
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
