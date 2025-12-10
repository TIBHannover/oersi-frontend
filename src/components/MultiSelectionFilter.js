import React, {useEffect, useState} from "react"
import {useRefinementList} from "react-instantsearch"
import {useTranslation} from "react-i18next"
import Accordion from "react-bootstrap/Accordion"
import Button from "react-bootstrap/Button"
import Collapse from "react-bootstrap/Collapse"
import Badge from "react-bootstrap/Badge"
import Form from "react-bootstrap/Form"
import {List} from "react-window"

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

const MultiSelectionItem = ({index, style, data, component, onSelectionChange}) => (
  <div style={style}>
    <Form.Check className="ms-1 pe-1" type="checkbox">
      <Form.Check.Input
        id={"check_" + component + data[index].key}
        type="checkbox"
        checked={data[index].checked}
        onChange={onSelectionChange}
        value={data[index].key}
      />
      <Form.Check.Label
        className="filter-item-label w-100 d-flex align-items-center"
        htmlFor={"check_" + component + data[index].key}
      >
        {onItemRender(data[index].label, data[index].count)}
      </Form.Check.Label>
    </Form.Check>
  </div>
)
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
    //         {onItemRender(d.label, d.count)}
    //       </Form.Check.Label>
    //     </Form.Check>
    //   ))}
    // </div>
    <List
      rowHeight={itemSize}
      rowCount={itemCount}
      width={"100%"}
      style={{height: listHeight}}
      rowProps={{
        data: props.data,
        component: props.component,
        onSelectionChange: props.onSelectionChange,
      }}
      rowComponent={MultiSelectionItem}
    />
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
          component={props.component}
          indent={props.indent}
          data={d}
          expanded={d.expanded}
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
  const {items, refine, searchForItems} = useRefinementList({
    attribute: props.componentId,
    limit: size || 100,
  })
  const data = items
  const [searchTerm, setSearchTerm] = useState("")
  const [reloadAggsSearchTerm, setReloadAggsSearchTerm] = useState(searchTerm)
  const [itemStates, setItemStates] = useState({})
  const [expandItemsDefault, setExpandItemsDefault] = useState(false)
  const onUpdateSearchTerm = (term) => {
    if (allowedSearchRegex && !term.match(allowedSearchRegex)) {
      return
    }
    setSearchTerm(term)
    expandAllItems()
  }
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
    if (!reloadAggregationsOnSearch) {
      return
    }
    const updateAggsSearchQuery = (term) => {
      const newReloadAggsSearchTerm =
        !term || term.length < aggregationSearchMinLength ? "" : term
      if (newReloadAggsSearchTerm !== reloadAggsSearchTerm) {
        searchForItems(newReloadAggsSearchTerm)
        setReloadAggsSearchTerm(newReloadAggsSearchTerm)
      }
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
    reloadAggregationsOnSearch,
    searchForItems,
    reloadAggsSearchTerm,
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
        {isHierarchicalFilter ? (
          <HierarchicalMultiSelectionItems
            component={props.componentId}
            data={transformData(data)}
            onToggleExpandItem={onToggleExpandItem}
            onSelectionChange={(d) => {
              d.selected
                ? onDeselectHierarchicalNode(d)
                : onSelectHierarchicalNode(d)
            }}
            t={t}
          />
        ) : (
          <MultiSelectionItems
            component={props.componentId}
            data={transformData(data)}
            onSelectionChange={(e) => {
              refine(e.target.value)
            }}
            t={t}
          />
        )}
      </Accordion.Body>
    </Accordion.Item>
  )

  function onSelectHierarchicalNode(node) {
    refine(node.key)
    // remove child-keys from values (because all children will be marked as "selected" anyway)
    for (const child of findAllChildNodes(node, (e) => e.isRefined)) {
      refine(child.key)
    }
  }
  function onDeselectHierarchicalNode(d) {
    // also deselect parent node
    if (d.parent) {
      onDeselectHierarchicalNode(d.parent)
    }
    // remove node key
    if (d.isRefined) {
      refine(d.key)
    }
    // add selected siblings
    for (const sibling of getSiblings(d).filter((e) => e.selected && !e.isRefined)) {
      refine(sibling.key)
    }
  }

  function transformData(data) {
    const matchesSearchTerm = (d) =>
      d.label?.match(new RegExp(".*" + searchTerm + ".*", "i"))
    data = data.map((d) => {
      return {
        ...d,
        key: d.value,
        doc_count: d.count,
      }
    })
    if (!isHierarchicalFilter) {
      return data
        .map((d) => {
          return {
            ...d,
            checked: d.isRefined,
            label: getDisplayValue(d.value, fieldOption, i18n),
          }
        })
        .filter(matchesSearchTerm)
    }
    const preparedData = new HierarchicalDataPreparer(data, vocabScheme)
      .modifyNodes((d) => {
        d.label = getDisplayValue(d.key, fieldOption, i18n)
        d.matchesSearch = matchesSearchTerm(d)
        d.isRefined = d.originalData.isRefined
      })
      .modifyNodes((d) => {
        d.expanded =
          d.key in itemStates ? itemStates[d.key].expanded : expandItemsDefault
        d.hidden =
          !d.matchesSearch &&
          findAllChildNodes(d, (e) => e.matchesSearch).length === 0
      }).data
    return addSelectedFlag(preparedData)
  }
}
function addSelectedFlag(data) {
  const addSelected = (d) => {
    d.selected = d.isRefined
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
