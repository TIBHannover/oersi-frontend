import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ISO6391 from "iso-639-1"


const CheckboxList = (props) => {
    const handleToggle = (value) => () => {
      props.onChange(value)
    };
    return (
      <div className="accordion-div">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="accordion-title">{props.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordion-rrot-list">
              <List >
                {props.data.map((value) =>
                  <ListItem className="list-item-mobile" button key={Math.random()} onClick={handleToggle(value.key)}>
                    <ListItemText value={value.key} primary={isUrl(value.key)} />
                    <ListItemSecondaryAction>
                      <label>{value.doc_count}</label>
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </div>
          </AccordionDetails>
        </Accordion>
  
      </div>
    )

    function isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        if (regexp.test(s)) {
          return s.split("/").slice(-2)[0].toUpperCase()
        } else if (s.length === 2) {
          return ISO6391.getName(s.toString().toLowerCase(), "en") !== ""
            ? ISO6391.getName(s.toString().toLowerCase(), "en")
            : s
        } else {
          return s;
        }
    
      }
}

export default CheckboxList