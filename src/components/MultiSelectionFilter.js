import React, {useEffect, useState} from "react"
import {MultiList} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Chip,
  Collapse,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {FixedSizeList} from "react-window"

import {getLabelForStandardComponent} from "../helpers/helpers"
import {OersiConfigContext} from "../helpers/use-context"
import {getRequest} from "../api/configuration/configurationService"
import {
  findAllChildNodes,
  getSiblings,
  HierarchicalDataPreparer,
  modifyAll,
  modifyAllParents,
} from "../helpers/vocabs"
import {ChevronRight, ExpandLess} from "@mui/icons-material"

const itemSize = 30

const MultiSelectionItems = (props) => {
  const itemCount = props.data ? props.data.length : 0
  const listHeight = Math.min(240, itemCount * itemSize)
  return (
    <FixedSizeList
      height={listHeight}
      itemCount={itemCount}
      itemSize={itemSize}
      width={"100%"}
    >
      {({index, style}) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.data[index].key in props.value}
              onChange={props.onSelectionChange}
              value={props.data[index].key}
              style={{height: itemSize + "px"}}
            />
          }
          label={onItemRender(props.data[index].label, props.data[index].doc_count)}
          className={"full-width"}
          sx={{mr: 0, mb: 0}}
          componentsProps={{
            typography: {
              sx: {display: "flex", alignItems: "center", overflow: "hidden"},
            },
          }}
          style={delete style.width && style}
          classes={{label: "filter-item-label full-width"}}
        />
      )}
    </FixedSizeList>
  )
}

const HierarchicalMultiSelectionItems = (props) => {
  return (
    <Box sx={{maxHeight: 240, overflow: "auto"}}>
      <HierarchicalMultiSelectionItemsRaw {...props} />
    </Box>
  )
}
const HierarchicalMultiSelectionItemsRaw = (props) => {
  return (
    <List component="div" disablePadding>
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
    </List>
  )
}
const HierarchicalMultiSelectionItem = (props) => {
  const {data} = props
  const indent = props.indent ? props.indent : 0
  const hasChildItems = data.children && data.children.length > 0
  return (
    <>
      {!data.hidden && (
        <ListItem
          key={data.key}
          sx={{
            padding: 0,
            paddingLeft: indent,
          }}
        >
          <IconButton
            size="small"
            onClick={() => props.onToggleExpandItem(data.key)}
            sx={{visibility: hasChildItems ? "visible" : "hidden"}}
            aria-label={"Expand " + data.key + " children"}
          >
            {props.expanded ? <ExpandLess /> : <ChevronRight />}
          </IconButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.selected || data.hasSelectedChild}
                color={data.selected ? "primary" : "default"}
                onChange={() => props.onSelectionChange(data)}
                value={data.key}
                style={{maxHeight: itemSize + "px"}}
              />
            }
            label={onItemRender(data.label ? data.label : data.key, data.doc_count)}
            className={"full-width"}
            sx={{mr: 0, mb: 0, overflow: "hidden"}}
            componentsProps={{
              typography: {
                sx: {display: "flex", alignItems: "center", overflow: "hidden"},
              },
            }}
            classes={{label: "filter-item-label full-width"}}
          />
        </ListItem>
      )}
      {hasChildItems ? (
        <Collapse in={props.expanded} unmountOnExit>
          <HierarchicalMultiSelectionItemsRaw
            {...props}
            data={data.children}
            indent={indent + 2}
          />
        </Collapse>
      ) : (
        ""
      )}
    </>
  )
}

const MultiSelectionFilter = (props) => {
  const oersiConfig = React.useContext(OersiConfigContext)
  const theme = useTheme()
  const {t} = useTranslation(["translation", "language", "labelledConcept"])
  const {dataField, size, allowedSearchRegex} = props
  const hierarchicalFilterConfig = oersiConfig.HIERARCHICAL_FILTERS?.find(
    (item) => item.componentId === props.componentId
  )
  const isHierarchicalFilter = hierarchicalFilterConfig !== undefined
  const [vocabScheme, setVocabScheme] = useState(null)
  const reloadAggregationsOnSearch =
    oersiConfig.AGGREGATION_SEARCH_COMPONENTS?.includes(props.componentId)
  const aggregationSearchDebounce = oersiConfig.AGGREGATION_SEARCH_DEBOUNCE
  const aggregationSearchMinLength = oersiConfig.AGGREGATION_SEARCH_MIN_LENGTH
  const [isExpanded, setExpanded] = useState(false)
  const onChangeExpanded = (event, expanded) => {
    setExpanded(expanded)
  }
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
    async function loadScheme() {
      if (hierarchicalFilterConfig !== undefined) {
        const schemeResponse = await getRequest(
          hierarchicalFilterConfig.schemeParentMap
        )
        if (schemeResponse.status === 200) {
          setVocabScheme(await schemeResponse.json())
        }
      }
    }
    loadScheme()
  }, [hierarchicalFilterConfig])

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
    <Accordion onChange={onChangeExpanded} square disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="div">
          <Box
            className="filter-heading"
            sx={{fontWeight: theme.typography.fontWeightBold}}
          >
            {t("LABEL." + props.title.toUpperCase())}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="multilist full-width">
          {props.showSearch && (
            <TextField
              inputProps={{"aria-label": "search " + props.componentId}}
              size="small"
              placeholder={t("LABEL." + props.placeholder.toUpperCase())}
              value={searchTerm}
              sx={{width: "100%", marginBottom: theme.spacing(1)}}
              InputProps={{sx: {borderRadius: "1em"}}}
              onChange={(event) => onUpdateSearchTerm(event.target.value)}
            />
          )}
          <MultiList
            className={props.className}
            dataField={dataField}
            componentId={props.componentId}
            showMissing={props.showMissing}
            missingLabel={"N/A"}
            showFilter={props.showFilter}
            showSearch={false} // use custom search-field instead (see above)
            size={size}
            value={values}
            onChange={setValues}
            filterLabel={props.filterLabel.toUpperCase()}
            URLParams={props.URLParams}
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
        </div>
      </AccordionDetails>
    </Accordion>
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
    const selectedSiblings = getSiblings(d).filter((e) => e.selected)
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
            label: getLabelForStandardComponent(d.key, props.componentId, t),
          }
        })
        .filter(matchesSearchTerm)
    }
    const preparedData = new HierarchicalDataPreparer(data, vocabScheme)
      .modifyNodes((d) => {
        d.label = getLabelForStandardComponent(d.key, props.componentId, t)
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
      <Box
        className="filter-item-label-text"
        title={label}
        sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
      >
        {label}
      </Box>
      <Chip
        className="filter-item-counter-badge"
        label={count}
        color="primary"
        size="small"
        sx={{ml: "auto", height: "unset"}}
      />
    </>
  )
}

export default MultiSelectionFilter
