import React from "react"
import {withTranslation} from "react-i18next"
import "./changeLanguageComponent.css"
import {setParams} from "../../helpers/helpers"
import {useHistory} from "react-router-dom"
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
const ChangeLanguageComponent = (props) => {
  const {t, i18n} = props
  let history = useHistory()
  const changeLanguageUI = (lng) => {
    i18n.changeLanguage(lng)
    history.push({
      pathname: "/",
      search:
        "?" +
        setParams(window.location, {
          name: "lng",
          value: lng,
        }).toString(),
    })
  }
  return (
    <div className="menu-language-div">
      <UncontrolledDropdown>
        <DropdownToggle className="menu-language" color="#606668" caret>
          {t(
            i18n.language === "en"
              ? "HEADER.CHANGE_LANGUAGE_ENGLISH"
              : "HEADER.CHANGE_LANGUAGE_GERMAN"
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            disabled={i18n.language === "en"}
            onClick={() => changeLanguageUI("en")}
          >
            {t("HEADER.CHANGE_LANGUAGE_ENGLISH")}
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            disabled={i18n.language === "de"}
            onClick={() => changeLanguageUI("de")}
          >
            {t("HEADER.CHANGE_LANGUAGE_GERMAN")}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  )
}

export default withTranslation()(ChangeLanguageComponent)
