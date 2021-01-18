import React from "react"
import {Menu, Dropdown, Button} from "antd"
import {withTranslation} from "react-i18next"
import "./menuComponent.css"
import {setParams} from "../../helpers/helpers"
import {useHistory} from "react-router-dom"

const MenuComponent = (props) => {
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
      <Dropdown
        className="menu-language"
        overlay={() => (
          <Menu>
            <Menu.Item>
              <Button
                disabled={i18n.language === "en"}
                onClick={() => changeLanguageUI("en")}
                type="text"
              >
                {t("HEADER.CHANGE_LANGUAGE_ENGLISH")}
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button
                disabled={i18n.language === "de"}
                onClick={() => changeLanguageUI("de")}
                type="text"
              >
                {t("HEADER.CHANGE_LANGUAGE_GERMAN")}
              </Button>
            </Menu.Item>
          </Menu>
        )}
      >
        <h6>
          {t(
            i18n.language === "en"
              ? "HEADER.CHANGE_LANGUAGE_ENGLISH"
              : "HEADER.CHANGE_LANGUAGE_GERMAN"
          )}
        </h6>
      </Dropdown>
    </div>
  )
}

export default withTranslation()(MenuComponent)
