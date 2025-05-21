import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import PropTypes from "prop-types"
import Button from "react-bootstrap/Button"
import {default as BootstrapCard} from "react-bootstrap/Card"
import Stack from "react-bootstrap/Stack"
import LazyLoad from "react-lazyload"

import {getLicenseIcon, hasLicenseIcon} from "./icons/CreativeCommonsIcons"
import ImageAltIcon from "./icons/ImageAltIcon"
import {
  concatPaths,
  getBaseFieldValues,
  getValuesFromRecord,
  processFieldOption,
  useInternalThumbnailUrl,
} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"

const CardText = (props) => {
  const {className, componentConfig, fieldOption, record, showEmpty} = props
  const {i18n} = useTranslation(["translation", "language", "labelledConcept"])
  const content = getContent()
  return (
    (showEmpty || content.length > 0) && (
      <div
        className={
          "resource-card-text resource-card-" +
          (componentConfig.field
            ? componentConfig.field.replace(".", "-")
            : "empty") +
          (className ? " " + className : "") +
          (componentConfig.bold ? " fw-bold" : "")
        }
        style={getStyle()}
      >
        {content.join(", ")}
      </div>
    )
  )

  function getStyle() {
    return {
      WebkitLineClamp: (componentConfig.maxLines || 1).toString(),
    }
  }

  function getContent() {
    if (!componentConfig) {
      return []
    }
    let content = getValuesFromRecord({field: componentConfig.field}, record)
      .filter((v) => v.field)
      .map((v) => v.field)
    if (content.length === 0 && componentConfig.fallback) {
      for (const fb of componentConfig.fallback) {
        content = getValuesFromRecord({field: fb}, record)
          .filter((v) => v.field)
          .map((v) => v.field)
        if (content.length > 0) {
          break
        }
      }
    }
    content = processFieldOption(content, fieldOption, i18n)
    return content ? content.flat() : []
  }
}
const PreviewImage = (props) => {
  const {resourceId, defaultImage, imageTitle} = props
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const internalThumbnailUrl = useInternalThumbnailUrl(resourceId)
  const [thumbnailUrl, setThumbnailUrl] = useState(
    frontendConfig.FEATURES?.SIDRE_THUMBNAILS ? internalThumbnailUrl : defaultImage
  )
  const [imageAvailable, setImageAvailable] = useState(!!thumbnailUrl)
  const handleError = (e) => {
    e.target.onerror = null
    if (defaultImage !== thumbnailUrl) {
      setThumbnailUrl(defaultImage)
      setImageAvailable(!!defaultImage)
    } else {
      setImageAvailable(false)
    }
  }

  return (
    <div title={imageTitle} className="responsive-image-wrapper">
      {imageAvailable ? (
        <BootstrapCard.Img
          className="resource-card-media position-absolute top-0 left-0 bottom-0 right-0 w-100 h-100 object-fit-cover"
          variant="top"
          src={thumbnailUrl}
          aria-label="resource image"
          onError={handleError}
        />
      ) : (
        <ImageAltIcon className="resource-card-media position-absolute top-0 left-0 bottom-0 right-0 w-100 h-100 object-fit-cover p-3" />
      )}
    </div>
  )
}

const Card = (props) => {
  const navigate = useNavigate()
  const {t, i18n} = useTranslation(["translation", "language", "labelledConcept"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const cardConfig = frontendConfig.resultCard
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  const baseFieldConfig = frontendConfig.fieldConfiguration?.baseFields
  const baseFieldValues = getBaseFieldValues(
    baseFieldConfig,
    props,
    fieldsOptions,
    i18n
  )

  return (
    <BootstrapCard>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={baseFieldValues.resourceLink}
        className="resource-card-header-link"
        aria-label={baseFieldValues.title}
      >
        <LazyLoad offset={100} once>
          <PreviewImage
            resourceId={props._id}
            defaultImage={baseFieldValues.thumbnailUrl}
            imageTitle={baseFieldValues.resourceLink}
          />
        </LazyLoad>
        <BootstrapCard.Body className="pb-0">
          <div className="resource-card-header-title">
            <BootstrapCard.Subtitle>
              <CardText
                className="resource-card-subtitle2 text-muted"
                componentConfig={{bold: true, ...cardConfig.subtitle}}
                fieldOption={getFieldOption(cardConfig.subtitle?.field)}
                record={props}
                showEmpty={true}
              />
            </BootstrapCard.Subtitle>
            <BootstrapCard.Title>
              <CardText
                componentConfig={{
                  bold: true,
                  maxLines: 2,
                  field: baseFieldConfig.title,
                  ...cardConfig.title,
                }}
                fieldOption={getFieldOption(
                  cardConfig.title?.field || baseFieldConfig.title
                )}
                record={props}
              />
            </BootstrapCard.Title>
          </div>
        </BootstrapCard.Body>
      </a>
      <BootstrapCard.Body className="pt-0">
        <BootstrapCard.Text as="div" className="resource-card-infos">
          <Stack direction="vertical" gap={2}>
            {cardConfig.content?.map((e) => (
              <CardText
                key={e.field}
                className="resource-card-body1"
                componentConfig={e}
                fieldOption={getFieldOption(e.field)}
                record={props}
              />
            ))}
          </Stack>
        </BootstrapCard.Text>
        <Stack className="resource-card-actions" direction="horizontal" gap={3}>
          <div>{getLicense()}</div>
          <Button
            variant={frontendConfig.isDarkMode ? "dark" : "light"}
            className="button-details"
            onClick={() =>
              navigate(
                concatPaths(frontendConfig.routes.DETAILS_BASE, "/" + props._id)
              )
            }
          >
            {t("LABEL.SHOW_DETAILS")}
          </Button>
        </Stack>
      </BootstrapCard.Body>
    </BootstrapCard>
  )

  function getFieldOption(fieldName) {
    return fieldsOptions?.find((x) => x.dataField === fieldName)
  }

  function getLicense() {
    if (baseFieldValues.licenseUrl) {
      const licenseGroup = baseFieldValues.licenseGroup
      if (licenseGroup && licenseGroup.toUpperCase() !== "OTHER") {
        return hasLicenseIcon(licenseGroup.toLowerCase()) ? (
          <Button
            variant={frontendConfig.isDarkMode ? "dark" : "light"}
            className="resource-card-action-license"
            target="_blank"
            rel="noreferrer"
            href={baseFieldValues.licenseUrl}
            aria-label={licenseGroup}
          >
            {getLicenseIcon(licenseGroup.toLowerCase())}
          </Button>
        ) : (
          <Button
            variant="light"
            className="resource-card-action-license"
            target="_blank"
            rel="noreferrer"
            href={baseFieldValues.licenseUrl}
            aria-label={licenseGroup}
          >
            {licenseGroup}
          </Button>
        )
      }
    }
    return <></>
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default Card
