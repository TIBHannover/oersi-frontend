import React from "react"
import "./Card.css"
//import moment from "moment"
//import "moment/locale/de"
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
//import i18next from "i18next"
import Tooltip from "@material-ui/core/Tooltip"
import {getLicenseGroup} from "../../../helpers/helpers"

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
  const iconJson = "json_ld_icon_132293.svg"
  return (
    <React.Fragment>
      <Card className="card-card-root m-3">
        <Link target="_blank" href={props.id} className="card-card-header-link">
          <CardMedia
            className="card-card-media"
            image={props.image}
            title={props.id}
          />
          <CardHeader className="card-card-header" title={props.name} />
        </Link>
        <CardContent>
          {props.description && (
            <Typography
              variant="body1"
              className={
                "card-description" + (expanded ? "" : " card-hide-overflow")
              }
            >
              {props.description}
            </Typography>
          )}
          <div className="card-infos">
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
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <div className="card-actions">
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
              {props.license && (
                <IconButton
                  target="_blank"
                  href={props.license}
                  aria-label="link to license"
                >
                  <img
                    className="card-action-img"
                    src={
                      process.env.PUBLIC_URL +
                      "/licence/" +
                      getLicenseGroup(props.license).toLowerCase() +
                      ".svg"
                    }
                    alt={getLicenseGroup(props.license).toLowerCase()}
                  />
                </IconButton>
              )}
              <Tooltip title={props.t("CARD.JSON")} arrow>
                <IconButton
                  target="_blank"
                  href={process.env.PUBLIC_URL + "/" + props._id}
                  aria-label="link to json-ld"
                >
                  <img
                    className="card-action-img"
                    src={process.env.PUBLIC_URL + "/" + iconJson}
                    alt="Json Icon"
                  />
                </IconButton>
              </Tooltip>
            </Collapse>
          </div>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
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

  function getCardInfoTextEntry(text) {
    return text ? (
      <Typography
        variant="body1"
        className={
          "card-info mt-3" + (expanded ? "" : " card-hide-overflow-single-line")
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

  //  function formatDate(date, format) {
  //    if (date !== null) {
  //      moment.locale(i18next.language)
  //      return moment(date).format(format)
  //    } else {
  //      return ""
  //    }
  //  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default withTranslation([
  "translation",
  "language",
  "lrt",
  "subject",
])(TileCard)
