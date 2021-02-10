import React from "react"
import "./Card.css"
import moment from "moment"
import "moment/locale/de"
import {withTranslation} from "react-i18next"
import PropTypes from "prop-types"
import {makeStyles} from "@material-ui/core/styles"
import clsx from "clsx"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import StorageIcon from "@material-ui/icons/Storage"
import Chip from "@material-ui/core/Chip"
import Link from "@material-ui/core/Link"
import i18next from "i18next"
import Tooltip from "@material-ui/core/Tooltip"
import {getLicenseGroup} from "../../../helpers/helpers"
import {
  LicenseCcByIcon,
  LicenseCcByNcIcon,
  LicenseCcByNdIcon,
  LicenseCcBySaIcon,
  LicenseCcByNcNdIcon,
  LicenseCcByNcSaIcon,
  LicenseCcZeroIcon,
  LicensePdIcon,
} from "./CustomIcons"
import {JsonLinkedDataIcon} from "./CustomIcons"
import HelpOutline from "@material-ui/icons/HelpOutline"

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

const TileCard = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <React.Fragment>
      <Card className="card-card-root m-3">
        <Link target="_blank" href={props.id} className="card-header-link">
          <CardMedia
            className="card-card-media"
            image={
              props.image
                ? props.image
                : process.env.PUBLIC_URL + "/help_outline.svg"
            }
            title={props.id}
          />
          <CardHeader
            className="card-header-title"
            title={
              <Typography
                variant="h5"
                component="div"
                className={"card-hide-overflow " + (expanded ? "card-line-clamp-eight" : "card-line-clamp-two")}
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
                "card-description card-hide-overflow " + (expanded ? "card-line-clamp-eight" : "card-line-clamp-four")
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
                props.t("subject#" + label, {
                  keySeparator: false,
                  nsSeparator: "#",
                })
            )
          )}
          {getCardInfoTextEntry(
            joinArrayField(
              props.learningResourceType,
              (item) => item.id,
              (label) =>
                props.t("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
            )
          )}
          <Collapse in={expanded} timeout="auto">
            {getCardInfoTextEntry(
              joinArrayField(props.creator, (item) => item.name)
            )}
            {getCardInfoTextEntry(
              joinArrayField(props.sourceOrganization, (item) => item.name)
            )}
            {getCardInfoTextEntry(maxModifiedDate(props.mainEntityOfPage))}
            {props.inLanguage &&
              getCardInfoTextEntry(props.t("language:" + props.inLanguage))}
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
          </Collapse>
        </CardContent>
        <CardActions className="card-actions mt-auto" disableSpacing>
          <div>
            {props.license && (
              <IconButton
                className="card-action-license"
                target="_blank"
                href={props.license}
                aria-label="link to license"
              >
                {getLicenseIcon(props.license)}
              </IconButton>
            )}
            <Collapse in={expanded} timeout="auto">
              {props.mainEntityOfPage
                ? props.mainEntityOfPage
                    .filter((e) => e.provider && e.provider.name)
                    .map((item) => {
                      return (
                        <Button
                          target="_blank"
                          href={item.id}
                          startIcon={<StorageIcon />}
                          key={item.provider.name + props._id}
                        >
                          {item.provider.name}
                        </Button>
                      )
                    })
                : ""}
              <Tooltip title={props.t("LABEL.JSON")} arrow>
                <IconButton
                  target="_blank"
                  href={process.env.PUBLIC_URL + "/" + props._id}
                  aria-label="link to json-ld"
                >
                  <JsonLinkedDataIcon />
                </IconButton>
              </Tooltip>
            </Collapse>
          </div>
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
        </CardActions>
      </Card>
    </React.Fragment>
  )

  function getLicenseIcon(license) {
    const licenseGroup = getLicenseGroup(props.license).toLowerCase()
    if (licenseGroup === "by") {
      return <LicenseCcByIcon />
    } else if (licenseGroup === "by-nc") {
      return <LicenseCcByNcIcon />
    } else if (licenseGroup === "by-nc-nd") {
      return <LicenseCcByNcNdIcon />
    } else if (licenseGroup === "by-nc-sa") {
      return <LicenseCcByNcSaIcon />
    } else if (licenseGroup === "by-nd") {
      return <LicenseCcByNdIcon />
    } else if (licenseGroup === "by-sa") {
      return <LicenseCcBySaIcon />
    } else if (licenseGroup === "pdm") {
      return <LicensePdIcon />
    } else if (licenseGroup === "zero") {
      return <LicenseCcZeroIcon />
    } else {
      return <HelpOutline />
    }
  }

  function getCardInfoTextEntry(text) {
    return text ? (
      <Typography
        variant="body1"
        className={
          "card-info mt-3" + (expanded ? "" : " card-hide-overflow card-line-clamp-one")
        }
        component="div"
      >
        {text}
      </Typography>
    ) : (
      ""
    )
  }

  /**
   * Access a field of the given array and join the values. The values can also be translated.
   * @param {array} array to process
   * @param {fieldAccessor} method that receives an item of the array and should return the field value
   * @param {fieldTranslation} optional, translation-function that translates the field-value
   */
  function joinArrayField(array, fieldAccessor, fieldTranslation) {
    if (array) {
      const filteredArray = array.filter((item) => fieldAccessor(item))
      const fields = filteredArray.map((item) =>
        fieldTranslation
          ? fieldTranslation(fieldAccessor(item))
          : fieldAccessor(item)
      )
      return fields.join(", ")
    }
    return ""
  }

  function maxModifiedDate(mainEntityOfPageArray) {
    if (mainEntityOfPageArray) {
      const dates = mainEntityOfPageArray
        .filter((item) => item.dateModified)
        .map((item) => item.dateModified)
      let maxDate
      for (let i = 0; i < dates.length; i++) {
        if (!maxDate || dates[i] > maxDate) {
          maxDate = dates[i]
        }
      }
      if (maxDate) {
        return formatDate(maxDate, "ll")
      }
    }
    return ""
  }

  function formatDate(date, format) {
    if (date !== null) {
      moment.locale(i18next.language)
      return moment(date).format(format)
    } else {
      return ""
    }
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default withTranslation(["translation", "language", "lrt", "subject"])(
  TileCard
)
