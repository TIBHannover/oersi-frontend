import React, {useEffect, useState} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import Accordion from "react-bootstrap/Accordion"
import Button from "react-bootstrap/Button"
import Collapse from "react-bootstrap/Collapse"
import Badge from "react-bootstrap/Badge"
import Form from "react-bootstrap/Form"
import {FixedSizeList} from "react-window"

import {concatPaths, getDisplayValue} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {
  findAllChildNodes,
  getSiblings,
  HierarchicalDataPreparer,
  modifyAll,
  modifyAllParents,
} from "../helpers/vocabs"
import CaretDownIcon from "./icons/CaretDownIcon"
import CaretRightIcon from "./icons/CaretRightIcon"

const itemSize = 24

const MultiSelectionItems = (props) => {
  const itemCount = props.data ? props.data.length : 0
  const listHeight = Math.min(240, itemCount * itemSize)
  return (
    // alternative without react-window:
    // <div className="multiselection-list overflow-scroll">
    //   {props.data.map((d) => (
    //     <Form.Check
    //       key={props.component + d.key}
    //       className="ms-1"
    //       type="checkbox"
    //       // style={{height: itemSize + "px"}}
    //     >
    //       <Form.Check.Input
    //         id={"check_" + props.component + d.key}
    //         type="checkbox"
    //         checked={d.key in props.value}
    //         onChange={props.onSelectionChange}
    //         value={d.key}
    //       />
    //       <Form.Check.Label
    //         className="filter-item-label d-flex align-items-center"
    //         htmlFor={"check_" + props.component + d.key}
    //       >
    //         {onItemRender(d.label, d.doc_count)}
    //       </Form.Check.Label>
    //     </Form.Check>
    //   ))}
    // </div>
    <FixedSizeList
      height={listHeight}
      itemCount={itemCount}
      itemSize={itemSize}
      width={"100%"}
    >
      {({index, style}) => (
        <div style={style}>
          <Form.Check className="ms-1 pe-1" type="checkbox">
            <Form.Check.Input
              id={"check_" + props.component + props.data[index].key}
              type="checkbox"
              checked={props.data[index].key in props.value}
              onChange={props.onSelectionChange}
              value={props.data[index].key}
            />
            <Form.Check.Label
              className="filter-item-label w-100 d-flex align-items-center"
              htmlFor={"check_" + props.component + props.data[index].key}
            >
              {onItemRender(props.data[index].label, props.data[index].doc_count)}
            </Form.Check.Label>
          </Form.Check>
        </div>
      )}
    </FixedSizeList>
  )
}

const HierarchicalMultiSelectionItems = (props) => {
  return (
    <div className="multiselection-list overflow-y-scroll">
      <HierarchicalMultiSelectionItemsRaw {...props} />
    </div>
  )
}
const HierarchicalMultiSelectionItemsRaw = (props) => {
  return (
    <>
      {props.data.map((d) => (
        <HierarchicalMultiSelectionItem
          key={d.key}
          indent={props.indent}
          data={d}
          expanded={d.expanded}
          value={props.value}
          onSelectionChange={props.onSelectionChange}
          onToggleExpandItem={props.onToggleExpandItem}
        />
      ))}
    </>
  )
}
const HierarchicalMultiSelectionItem = (props) => {
  const {data} = props
  const indent = props.indent ? props.indent : 0
  const hasChildItems = data.children && data.children.length > 0
  return (
    <>
      {!data.hidden && (
        <div key={data.key} className={"d-flex indent-" + indent}>
          <Button
            className="expand-button px-1 py-0 sidre-textcolor-secondary"
            aria-label={"Expand " + data.key + " children"}
            onClick={() => props.onToggleExpandItem(data.key)}
          >
            {props.expanded ? (
              <CaretDownIcon
                className={"align-baseline" + (hasChildItems ? "" : " invisible")}
              />
            ) : (
              <CaretRightIcon
                className={"align-baseline" + (hasChildItems ? "" : " invisible")}
              />
            )}
          </Button>
          <div className="w-100 overflow-hidden">
            <Form.Check
              key={props.component + data.key}
              className="ms-1"
              type="checkbox"
            >
              <Form.Check.Input
                id={"check_" + props.component + data.key}
                className={
                  data.hasSelectedChild && !data.selected
                    ? "hierarchical-checkbox-with-selected-child"
                    : ""
                }
                type="checkbox"
                checked={data.selected || data.hasSelectedChild}
                onChange={() => props.onSelectionChange(data)}
                value={data.key}
              />
              <Form.Check.Label
                className="filter-item-label d-flex align-items-center"
                htmlFor={"check_" + props.component + data.key}
              >
                {onItemRender(data.label ? data.label : data.key, data.doc_count)}
              </Form.Check.Label>
            </Form.Check>
          </div>
        </div>
      )}
      {hasChildItems ? (
        <Collapse in={props.expanded} mountOnEnter unmountOnExit>
          <HierarchicalMultiSelectionItemsRaw
            {...props}
            data={data.children}
            indent={indent + 1}
          />
        </Collapse>
      ) : (
        ""
      )}
    </>
  )
}

const MultiSelectionFilter = (props) => {
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {t, i18n} = useTranslation([
    "translation",
    "language",
    "labelledConcept",
    "data",
  ])
  const {dataField, size} = props
  const allowedSearchRegex =
    props.allowedSearchRegex !== undefined
      ? props.allowedSearchRegex
      : /^[\u00C0-\u017Fa-zA-Z0-9 .-]*$/
  const fieldOption = frontendConfig.fieldConfiguration?.options?.find(
    (x) => x.dataField === dataField
  )
  const labelKey = props.labelKey ? props.labelKey : dataField
  const isHierarchicalFilter = fieldOption?.isHierarchicalConcept
  const hierarchicalSchemeParentMap = isHierarchicalFilter
    ? fieldOption?.schemeParentMap
    : undefined
  const [vocabScheme, setVocabScheme] = useState(null)
  const reloadAggregationsOnSearch =
    props.reloadFilterOnSearchTermChange !== undefined
      ? props.reloadFilterOnSearchTermChange
      : false
  const aggregationSearchDebounce =
    props.reloadFilterDebounce !== undefined ? props.reloadFilterDebounce : 150
  const aggregationSearchMinLength =
    props.reloadFilterMinSearchTermLength !== undefined
      ? props.reloadFilterMinSearchTermLength
      : 3
  const [isExpanded, setExpanded] = useState(false)
  const [values, setValues] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [itemStates, setItemStates] = useState({})
  const [expandItemsDefault, setExpandItemsDefault] = useState(false)
  const onUpdateSearchTerm = (term) => {
    if (allowedSearchRegex && !term.match(allowedSearchRegex)) {
      return
    }
    setSearchTerm(term)
    expandAllItems()
  }
  const [defaultQuery, setDefaultQuery] = useState(
    props.defaultQuery ? props.defaultQuery() : null
  )
  const onToggleExpandItem = (itemKey) => {
    const updatedItemState =
      itemKey in itemStates
        ? {
            ...itemStates[itemKey],
            expanded: !itemStates[itemKey].expanded,
          }
        : {expanded: !expandItemsDefault}
    setItemStates({...itemStates, [itemKey]: updatedItemState})
  }
  const expandAllItems = () => {
    const updatedItemStates = {}
    for (let s in itemStates) {
      updatedItemStates[s] = {...s, expanded: true}
    }
    setItemStates(updatedItemStates)
    setExpandItemsDefault(true)
  }

  useEffect(() => {
    if (hierarchicalSchemeParentMap !== undefined) {
      fetch(
        concatPaths(frontendConfig.PUBLIC_BASE_PATH, hierarchicalSchemeParentMap)
      )
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => setVocabScheme(data))
    }
  }, [frontendConfig.PUBLIC_BASE_PATH, hierarchicalSchemeParentMap])

  useEffect(() => {
    const updateAggsSearchQuery = (term) => {
      if (!term || term.length < aggregationSearchMinLength) {
        setDefaultQuery(null)
        return
      }
      const script =
        "def r = []; for (a in doc['" +
        dataField +
        "']){if (a.toLowerCase(Locale.ROOT).contains('" +
        term.toLowerCase() +
        "')){r.add(a)}} return r"
      const query = {
        aggs: {
          [dataField]: {
            terms: {
              script: {source: script},
              size: size,
              order: {_count: "desc"},
            },
          },
        },
      }
      setDefaultQuery(query)
    }

    if (!reloadAggregationsOnSearch) {
      return
    }
    const timer = setTimeout(
      () => updateAggsSearchQuery(searchTerm),
      aggregationSearchDebounce
    )
    return () => clearTimeout(timer)
  }, [
    searchTerm,
    aggregationSearchDebounce,
    aggregationSearchMinLength,
    dataField,
    reloadAggregationsOnSearch,
    size,
  ])

  return (
    <Accordion.Item eventKey={props.componentId}>
      <Accordion.Header onClick={() => setExpanded(!isExpanded)}>
        <div className="filter-heading fw-bold">
          {t("data:fieldLabels." + labelKey)}
        </div>
      </Accordion.Header>
      <Accordion.Body className="multilist px-3">
        {props.showSearch && (
          <Form.Control
            className="mb-1 search-component-input"
            aria-label={"search " + props.componentId}
            size="sm"
            type="text"
            placeholder={t("data:fieldLabels." + labelKey)}
            value={searchTerm}
            onChange={(event) => onUpdateSearchTerm(event.target.value)}
          />
        )}
        <MultiList
          dataField={dataField}
          componentId={props.componentId}
          showMissing={props.showMissing !== undefined ? props.showMissing : true}
          missingLabel={"N/A"}
          showFilter={props.showFilter !== undefined ? props.showFilter : true}
          showSearch={false} // use custom search-field instead (see above)
          size={size}
          value={values}
          onChange={setValues}
          sortBy={props.sortBy !== undefined ? props.sortBy : "count"}
          filterLabel={labelKey}
          URLParams={props.URLParams !== undefined ? props.URLParams : true}
          react={props.react}
          customQuery={props.customQuery}
          defaultQuery={() => defaultQuery}
        >
          {({loading, error, data, value, handleChange}) => {
            if (!loading && !error && isExpanded) {
              if (isHierarchicalFilter) {
                return (
                  <HierarchicalMultiSelectionItems
                    component={props.componentId}
                    data={transformData(data, value)}
                    onToggleExpandItem={onToggleExpandItem}
                    value={value}
                    onSelectionChange={(d) => {
                      setValues(
                        d.selected
                          ? deselectHierarchicalNode(d)
                          : selectHierarchicalNode(d)
                      )
                    }}
                    t={t}
                  />
                )
              } else {
                return (
                  <MultiSelectionItems
                    component={props.componentId}
                    data={transformData(data, value)}
                    value={value}
                    onSelectionChange={handleChange}
                    t={t}
                  />
                )
              }
            }
          }}
        </MultiList>
      </Accordion.Body>
    </Accordion.Item>
  )

  function selectHierarchicalNode(node) {
    let newValues = values ? values : []
    // add node key to values
    newValues = [...newValues, node.key]

    // remove child-keys from values (because all children will be marked as "selected" anyway)
    const selectedChildren = findAllChildNodes(node, (e) => e.selected).map(
      (e) => e.key
    )
    newValues = newValues.filter((e) => !selectedChildren.includes(e))
    return newValues
  }
  function deselectHierarchicalNode(d) {
    let newValues = values ? values : []
    // also deselect parent node
    if (d.parent) {
      newValues = deselectHierarchicalNode(d.parent)
    }

    // remove node key from values
    newValues = newValues.filter((v) => v !== d.key)

    // add selected sibling keys to values
    const selectedSiblings = getSiblings(d).filter(
      (e) => e.selected && !newValues.includes(e.key)
    )
    newValues = [...newValues, ...selectedSiblings.map((e) => e.key)]
    return newValues
  }

  function transformData(data, value) {
    const matchesSearchTerm = (d) =>
      d.label?.match(new RegExp(".*" + searchTerm + ".*", "i"))
    if (!isHierarchicalFilter) {
      return data
        .map((d) => {
          return {
            ...d,
            label: getDisplayValue(d.key, fieldOption, i18n),
          }
        })
        .filter(matchesSearchTerm)
    }
    const preparedData = new HierarchicalDataPreparer(data, vocabScheme)
      .modifyNodes((d) => {
        d.label = getDisplayValue(d.key, fieldOption, i18n)
        d.matchesSearch = matchesSearchTerm(d)
      })
      .modifyNodes((d) => {
        d.expanded =
          d.key in itemStates ? itemStates[d.key].expanded : expandItemsDefault
        d.hidden =
          !d.matchesSearch &&
          findAllChildNodes(d, (e) => e.matchesSearch).length === 0
      }).data
    return addSelectedFlag(preparedData, value)
  }
  function addSelectedFlag(data, value) {
    const addSelected = (d) => {
      d.selected = d.key in value
      if (d.children?.length) {
        d.children = d.selected
          ? modifyAll(d.children, (e) => (e.selected = true))
          : d.children.map(addSelected)
      }
      if (d.selected) {
        modifyAllParents(d, (e) => {
          e.hasSelectedChild = true
        })
      }
      return d
    }
    return modifyAll(data, (d) => (d.hasSelectedChild = false)).map(addSelected)
  }
}
function onItemRender(label, count) {
  return (
    <>
      <div className="filter-item-label-text text-truncate" title={label}>
        {label}
      </div>
      <Badge pill={true} bg="primary" className="filter-item-counter-badge ms-auto">
        {count}
      </Badge>
    </>
  )
}

export default MultiSelectionFilter
