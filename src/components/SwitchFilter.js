import {SingleDataList} from "@appbaseio/reactivesearch"
import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useLocation} from "react-router"
import {getDisplayValue, getParams} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import Badge from "react-bootstrap/Badge"
import Form from "react-bootstrap/Form"

const LabelledSwitch = (props) => {
  return (
    <Form.Check type="switch">
      <Form.Check.Input
        id={"check_" + props.component}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChangeValue}
      />
      <Form.Check.Label
        className="filter-item-label full-width d-flex align-items-center"
        htmlFor={"check_" + props.component}
      >
        <div
          className="filter-item-label-text text-truncate"
          title={props.labelText}
        >
          {props.labelText}
        </div>
        <Badge
          pill={true}
          bg="primary"
          className="filter-item-counter-badge ms-auto"
        >
          {props.recordCount}
        </Badge>
      </Form.Check.Label>
    </Form.Check>
  )
}
const SwitchFilter = (props) => {
  const location = useLocation()
  const locationParam = getParams(location, props.componentId)
  const {i18n} = useTranslation(["translation", "labelledConcept", "data"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {dataField, switchableFieldValue, defaultChecked} = props
  const labelKey = props.labelKey ? props.labelKey : dataField
  const fieldOption = frontendConfig.fieldConfiguration?.options?.find(
    (x) => x.dataField === dataField
  )
  const [isChecked, setIsChecked] = useState(
    (locationParam != null && locationParam === '"' + switchableFieldValue + '"') ||
      defaultChecked
  )
  const toggleValue = () => {
    setIsChecked(!isChecked)
  }
  return (
    <div className="m-3">
      <SingleDataList
        {...props}
        filterLabel={labelKey}
        data={[{label: switchableFieldValue, value: switchableFieldValue}]}
        showSearch={false}
        showRadio={false}
        showCount={true}
        URLParams={true}
        value={isChecked ? switchableFieldValue : ""}
        onChange={(e) => {
          setIsChecked(e === switchableFieldValue)
        }}
      >
        {({data, value}) => {
          const item = data.find((e) => e.label === switchableFieldValue)
          return (
            <LabelledSwitch
              checked={value === switchableFieldValue}
              labelText={getDisplayValue(switchableFieldValue, fieldOption, i18n)}
              onChangeValue={toggleValue}
              recordCount={item.count}
            />
          )
        }}
      </SingleDataList>
    </div>
  )
}

export default SwitchFilter
