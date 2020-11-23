import React from "react"
import "./Card.css"
import {getLabelForLanguage} from "../../../helpers/helpers"
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
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Grid from "@material-ui/core/Grid"
import StorageIcon from "@material-ui/icons/Storage"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import GTranslateIcon from "@material-ui/icons/GTranslate"
import Chip from "@material-ui/core/Chip"
import Link from "@material-ui/core/Link"
import Avatar from "@material-ui/core/Avatar"
import i18next from "i18next"
import ReactTooltip from "react-tooltip"

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

const Cards = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const iconJson = "json_ld_icon_132293.svg"
  return (
    <React.Fragment>
      <ReactTooltip />
      <Card className="card-card-root">
        <CardHeader
          className="card-card-header"
          title={
            <Link target="_blank" href={props.id} className="card-card-header-link">
              {props.name}
            </Link>
          }
          subheader={formatDate(props.mainEntityOfPage[0].dateModified, "ll")}
        />
        <Grid container spacing={3} className="card-card-grid-container">
          <Grid item xs={12} sm={6}>
            {/* There is already an h1 in the page, let's not duplicate it. */}
            <Typography variant="body1" className="card-card-author" component="div">
              <b>{props.t("CARD.AUTHOR")}:</b> {joinArray(props.creator)}
              <br />
              <p className="card-card-organization">
                {joinArray(props.sourceOrganization) !== "" && (
                  <b>{props.t("CARD.ORGANIZATION")}: </b>
                )}
                {joinArray(props.sourceOrganization)}
              </p>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            {props.license !== null && (
              <Link target="_blank" href={props.license} color="inherit">
                <Typography
                  variant="body1"
                  className="card-card-license"
                  component="p"
                >
                  <b>{props.t("CARD.LICENSE")}: </b>{" "}
                  <img
                    width="100px"
                    height="40"
                    src={
                      process.env.PUBLIC_URL +
                      "/licence/" +
                      licenseSplit(props.license).toLowerCase() +
                      ".svg"
                    }
                    alt={licenseSplit(props.license).toLowerCase()}
                  />
                </Typography>
              </Link>
            )}
          </Grid>
          <Grid className="card-card-image" item xs={12} lg={6} md={12} sm={12}>
            <Link target="_blank" href={props.id} color="inherit">
              <CardMedia
                className="card-card-media"
                image={props.image}
                title={props.image}
              />
            </Link>
          </Grid>
          <Grid
            className="card-card-description"
            item
            xs={12}
            md={12}
            lg={6}
            sm={12}
          >
            <CardContent className="card-card-content">
              <Typography variant="h6" className="card-card-typografi-h6">
                {props.description}
              </Typography>
            </CardContent>
          </Grid>
          {/* </Grid> */}
        </Grid>
        <Grid item xs={12} md={12} sm={12}></Grid>
        {props.about[0].id && (
          <Grid item xs={12} md={12} sm={12} className="card-margin-top">
            <b className="card-subject">{props.t("CARD.SUBJECT")}:</b>
            {props.about.map((item) => {
              return (
                <span key={Math.random()} className="about-card-chip-root">
                  <span className="badge badge-info">
                    {props.t("subject#" + item.id, {
                      keySeparator: false,
                      nsSeparator: "#",
                    })}
                  </span>
                </span>
              )
            })}
          </Grid>
        )}

        <CardActions disableSpacing>
          <div className="card-card-chip-root">
            <Chip
              icon={<InsertDriveFileIcon />}
              label={
                props.learningResourceType.id
                  ? props.t("lrt#" + props.learningResourceType.id, {
                      keySeparator: false,
                      nsSeparator: "#",
                    })
                  : ""
              }
              // onClick={handleClick}
              // onDelete={handleDelete}
            />
            <Chip
              icon={<GTranslateIcon />}
              label={getLabelForLanguage(
                props.inLanguage,
                i18next.language,
                i18next.languages
              )}
              // onClick={handleClick}
              // onDelete={handleDelete}
            />
            {props.mainEntityOfPage
              .filter((e) => e.provider && e.provider.name)
              .map((item) => {
                return (
                  <Link
                    target="_blank"
                    href={item.id}
                    key={item.provider.name}
                    className="card-card-chip-root"
                  >
                    <Chip
                      icon={<StorageIcon />}
                      clickable={true}
                      label={props.t("provider:" + item.provider.name, {
                        keySeparator: false,
                      })}
                    />
                  </Link>
                )
              })}

            <Link
              href={process.env.PUBLIC_URL + "/" + props._id}
              className="card-card-chip-jsonLink"
              data-tip={props.t("CARD.JSON")}
            >
              <Chip
                avatar={
                  <Avatar
                    alt="Json Icon"
                    className="img-json"
                    src={process.env.PUBLIC_URL + "/" + iconJson}
                  />
                }
                clickable={true}
              />
            </Link>
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography className="card-card-typografi-h6" paragraph>
              {props.t("CARD.PARAGRAF_TEXT")}:
            </Typography>
            <Typography className="card-card-typografi-h6" paragraph>
              {props.description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  )

  /**
   * split the license and get last 2 chars
   * @param {string} license
   */
  function licenseSplit(license) {
    if (license !== null) return license.split("/").slice(-2)[0]
    else return ""
  }

  function joinArray(arrayToJoin) {
    if (arrayToJoin.length > 0 && arrayToJoin[0].name)
      return arrayToJoin.map((el) => el.name).join(", ")

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

export default withTranslation(["translation", "provider", "lrt", "subject"])(Cards)
