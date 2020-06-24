import React from "react"
import "./linkComponent.css"
import PropTypes from "prop-types"

/**
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const LinkComponent = (props) => {
  return (
    <div>
      <a
        className="link-component"
        target="_blank"
        rel="noopener noreferrer"
        href={props.link}
      >
        {props.children}
      </a>
    </div>
  )
}

LinkComponent.propTypes = {
  link: PropTypes.string,
}

export default LinkComponent
