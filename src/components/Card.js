import React from "react"
import {useTranslation} from "react-i18next"
import PropTypes from "prop-types"
import {makeStyles} from "@material-ui/core/styles"
import clsx from "clsx"
import {
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import InputIcon from "@material-ui/icons/Input"
import StorageIcon from "@material-ui/icons/Storage"
import LazyLoad from "react-lazyload"

import "./Card.css"
import {getLicenseIcon, JsonLinkedDataIcon} from "./CustomIcons"
import EmbedDialog from "./EmbedDialog"
import {isEmbeddable} from "../helpers/embed-helper"
import {
  formatDate,
  getLicenseGroup,
  getSafeUrl,
  joinArrayField,
} from "../helpers/helpers"
import {OersiConfigContext} from "../helpers/use-context"

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}))

const Card = (props) => {
  const {t} = useTranslation(["translation", "language", "lrt", "subject"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(
    props.expanded ? props.expanded : false
  )
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const [embedDialogOpen, setEmbedDialogOpen] = React.useState(false)
  const handleClickEmbedDialogOpen = () => {
    setEmbedDialogOpen(true)
  }
  const handleEmbedDialogClose = (value) => {
    setEmbedDialogOpen(false)
  }

  const licenseGroup = getLicenseGroup(props.license).toLowerCase()
  const ExtendedCardContent = () => {
    return (
      <>
        {getCardInfoTextEntry(
          joinArrayField(props.creator, (item) => item.name),
          "author"
        )}
        {getCardInfoTextEntry(
          joinArrayField(props.sourceOrganization, (item) => item.name),
          "organization"
        )}
        {getCardInfoTextEntry(
          maxModifiedDate(props.mainEntityOfPage),
          "lastModified"
        )}
        {getCardInfoTextEntry(
          joinArrayField(
            props.inLanguage,
            (item) => item,
            (label) => t("language:" + label)
          ),
          "language"
        )}
        {props.keywords && props.keywords[0] && (
          <div className="card-info mt-3">
            {props.keywords.map((item) => (
              <Chip
                key={item + props._id}
                className="m-1"
                size="small"
                label={item}
              />
            ))}
          </div>
        )}
      </>
    )
  }
  const ExtendedCardActions = () => {
    return (
      <>
        {props.mainEntityOfPage
          ? props.mainEntityOfPage
              .filter((e) => e.provider && e.provider.name)
              .map((item) => {
                return (
                  <Button
                    target="_blank"
                    rel="noopener"
                    href={getSafeUrl(item.id)}
                    startIcon={<StorageIcon />}
                    key={item.provider.name + props._id}
                  >
                    {item.provider.name}
                  </Button>
                )
              })
          : ""}
        <Tooltip title={t("LABEL.JSON")} arrow>
          <IconButton
            target="_blank"
            href={process.env.PUBLIC_URL + "/" + props._id + "?format=json"}
            aria-label="link to json-ld"
          >
            <JsonLinkedDataIcon />
          </IconButton>
        </Tooltip>
      </>
    )
  }
  return (
    <React.Fragment>
      <MuiCard className="card-card-root m-3">
        <Link
          target="_blank"
          rel="noopener"
          href={getSafeUrl(props.id)}
          className="card-header-link"
          aria-label={props.name}
        >
          <LazyLoad offset={100} once>
            <CardMedia
              className="card-card-media"
              image={
                props.image
                  ? props.image
                  : process.env.PUBLIC_URL + "/help_outline.svg"
              }
              title={props.id}
            />
          </LazyLoad>
          <CardHeader
            className="card-header-title"
            title={
              <Typography
                variant="h5"
                component="div"
                className={
                  "card-hide-overflow " +
                  (expanded ? "card-line-clamp-eight" : "card-line-clamp-two")
                }
              >
                {props.name}
              </Typography>
            }
          />
        </Link>
        <CardContent className="card-infos">
          {props.description && (
            <Typography
              variant="body1"
              className={
                "card-description card-hide-overflow " +
                (expanded ? "card-line-clamp-eight" : "card-line-clamp-four")
              }
            >
              {props.description}
            </Typography>
          )}
          {getCardInfoTextEntry(
            joinArrayField(
              props.about,
              (item) => item.id,
              (label) =>
                t("subject#" + label, {
                  keySeparator: false,
                  nsSeparator: "#",
                })
            )
          )}
          {getCardInfoTextEntry(
            joinArrayField(
              props.learningResourceType,
              (item) => item.id,
              (label) => t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
            )
          )}
          {!oersiConfig.FEATURES.USE_RESOURCE_PAGE && (
            <Collapse in={expanded} timeout="auto" mountOnEnter unmountOnExit>
              <ExtendedCardContent />
            </Collapse>
          )}
        </CardContent>
        <CardActions className="card-actions mt-auto" disableSpacing>
          <div>
            {props.license && props.license.id && (
              <IconButton
                className="card-action-license"
                target="_blank"
                rel="noreferrer"
                href={getSafeUrl(props.license.id)}
                aria-label={licenseGroup}
              >
                {getLicenseIcon(licenseGroup)}
              </IconButton>
            )}
            {!oersiConfig.FEATURES.USE_RESOURCE_PAGE && (
              <>
                {oersiConfig.FEATURES.EMBED_OER &&
                  isEmbeddable({...props, licenseGroup: licenseGroup}) && (
                    <>
                      <Button
                        className="card-action-embed"
                        onClick={handleClickEmbedDialogOpen}
                        startIcon={<InputIcon />}
                        key={"embed" + props._id}
                      >
                        {t("EMBED_MATERIAL.EMBED")}
                      </Button>
                      <EmbedDialog
                        open={embedDialogOpen}
                        onClose={handleEmbedDialogClose}
                        data={{...props, licenseGroup: licenseGroup}}
                      />
                    </>
                  )}
                <Collapse in={expanded} timeout="auto" mountOnEnter unmountOnExit>
                  <ExtendedCardActions />
                </Collapse>
              </>
            )}
          </div>
          {oersiConfig.FEATURES.USE_RESOURCE_PAGE ? (
            <Button
              className="button-details"
              href={process.env.PUBLIC_URL + "/" + props._id}
              key={"button-details" + props._id}
            >
              {t("LABEL.SHOW_DETAILS")}
            </Button>
          ) : (
            <IconButton
              className={
                "mt-auto " +
                clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })
              }
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </CardActions>
      </MuiCard>
    </React.Fragment>
  )

  function getCardInfoTextEntry(text, ariaLabel) {
    return text ? (
      <Typography
        variant="body1"
        aria-label={ariaLabel}
        className={
          "card-info mt-3" +
          (expanded ? "" : " card-hide-overflow card-line-clamp-one")
        }
        component="div"
      >
        {text}
      </Typography>
    ) : (
      ""
    )
  }

  function maxModifiedDate(mainEntityOfPageArray) {
    if (mainEntityOfPageArray) {
      const dates = mainEntityOfPageArray
        .filter((item) => item.dateModified)
        .map((item) => item.dateModified)
      let maxDate
      for (const date of dates) {
        if (!maxDate || date > maxDate) {
          maxDate = date
        }
      }
      if (maxDate) {
        return formatDate(maxDate, "ll")
      }
    }
    return ""
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default Card
