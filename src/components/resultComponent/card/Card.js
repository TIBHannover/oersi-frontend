import React from "react"
import "./Card.css"
import moment from "moment"
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
import ISO6391 from "iso-639-1"

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
  return (
    <React.Fragment>
      <Card className="card-card-root">
        <CardHeader
          className="card-card-header"
          title={
            <Link
              target="_blank"
              href={props.mainEntityOfPage.basedOn.id}
              className="card-card-header-link"
            >
              {props.name}
            </Link>
          }
          subheader={
            props.mainEntityOfPage.dateModified !== null &&
            moment(props.mainEntityOfPage.dateModified).format("MMM Do YY")
          }
        />
        <Grid container spacing={3} className="card-card-grid-container">
          <Grid item xs={12} sm={6}>
            {/* There is already an h1 in the page, let's not duplicate it. */}
            <Typography variant="body1" className="card-card-author" component="p">
              <b>{props.t("CARD.AUTHOR")}:</b> {props.creator[0].name}
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
          {/* <Grid item xs={12} md={12} sm={12}> */}
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Link target="_blank" href="#" color="inherit">
              <CardMedia
                className="card-card-media"
                image={props.image}
                title={props.image}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={12} lg={6} sm={12}>
            <CardContent className="card-card-content">
              <Typography variant="h6" className="card-card-typografi-h6">
                {props.description}
              </Typography>
            </CardContent>
          </Grid>
          {/* </Grid> */}
        </Grid>

        <CardActions disableSpacing>
          <div className="card-card-chip-root">
            <Chip
              icon={<InsertDriveFileIcon />}
              label={props.learningResourceType.id}
              // onClick={handleClick}
              // onDelete={handleDelete}
            />
            <Chip
              icon={<GTranslateIcon />}
              label={
                props.inLanguage !== null &&
                ISO6391.getName(props.inLanguage.toString().toLowerCase(), "en") !==
                  ""
                  ? ISO6391.getName(props.inLanguage.toString().toLowerCase(), "en")
                  : props.inLanguage
              }
              // onClick={handleClick}
              // onDelete={handleDelete}
            />
            <Chip
              icon={<StorageIcon />}
              label={props.t("provider:" + props.mainEntityOfPage.basedOn.provider, {
                keySeparator: false,
              })}
              // onClick={handleClick}
              // onDelete={handleDelete}
            />
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
    console.log(license)
    if (license !== null) return license.split("/").slice(-2)[0]
    else return ""
  }
}

Card.propTypes = {
  props: PropTypes.object,
}

export default withTranslation(["translation", "provider"])(Cards)
