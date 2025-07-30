import {history} from "instantsearch.js/es/lib/routers"

function prepareSearchConfiguration(frontendConfig) {
  const searchConfig = frontendConfig.search
  const fieldsOptions = frontendConfig.fieldConfiguration?.options
  let dataFields = searchConfig.searchField.dataField
  let fieldWeights = searchConfig.searchField.fieldWeights
  const searchAttributes = dataFields.map((dataField, index) => {
    return fieldWeights[index]
      ? {
          field: dataField,
          weight: fieldWeights[index],
        }
      : dataField
  })
  const facetAttributes = searchConfig.filters.map((filter) => {
    const type = filter.type ?? "multiSelection"
    const facetAttribute = {
      attribute: filter.componentId,
      field: filter.dataField,
      type: "string",
    }
    if (type === "multiSelection") {
      facetAttribute.facetQuery = getMultiSelectionFacetQuery(filter, fieldsOptions)
      facetAttribute.filterQuery = getMultiSelectionFilterQuery(
        filter,
        fieldsOptions
      )
    }
    return facetAttribute
  })
  return enrichDefaultConfig(
    {
      globalDataRestrictions: searchConfig.globalDataRestrictions
        ? {
            componentId: "globalDataRestrictions",
            queries: searchConfig.globalDataRestrictions,
          }
        : null,
      resultList: {
        componentId: "results",
        pagination: true,
        paginationAt: "bottom",
        ...searchConfig.resultList,
      },
      searchField: {
        componentId: "search",
        ...searchConfig.searchField,
        searchAttributes: searchAttributes,
      },
      facet_attributes: facetAttributes,
      filters: searchConfig.filters,
    },
    fieldsOptions
  )
}
function getMultiSelectionFilterQuery(filter, fieldsOptions) {
  const showMissing = filter.showMissing ?? true
  const fieldOptions = fieldsOptions?.find((e) => e.dataField === filter.dataField)
  if (fieldOptions?.grouping) {
    return getCustomSelectFacetValueQuery(
      filter.dataField,
      fieldOptions?.grouping,
      fieldOptions?.collectOthersInSeparateGroup,
      showMissing
    )
  }
  return (field, value) => {
    if (showMissing && value === "N/A") {
      return {
        bool: {
          must_not: {exists: {field: field}},
        },
      }
    }
    return {
      match: {
        [field]: value,
      },
    }
  }
}
function getMultiSelectionFacetQuery(filter, fieldsOptions) {
  const showMissing = filter.showMissing ?? true
  const fieldOptions = fieldsOptions?.find((e) => e.dataField === filter.dataField)
  if (fieldOptions?.grouping) {
    return getCustomAggregationQuery(
      filter.dataField,
      fieldOptions?.grouping,
      fieldOptions?.collectOthersInSeparateGroup,
      showMissing
    )
  }
  return (field, size, query) => {
    if (!query) {
      const result = {
        terms: {
          field: field,
          size: size,
          order: {_count: "desc"},
        },
      }
      if (showMissing) {
        result.terms.missing = "N/A"
      }
      return result
    }
    const script =
      "def r = []; for (a in doc['" +
      field +
      "']){if (a.toLowerCase(Locale.ROOT).contains('" +
      query.toLowerCase() +
      "')){r.add(a)}} return r"
    return {
      terms: {
        script: {source: script},
        size: size,
        order: {_count: "desc"},
      },
    }
  }
}
function enrichDefaultConfig(defaultConfig, fieldsOptions) {
  const filters = defaultConfig.filters.map((e) => ({
    componentId: e.dataField,
    ...e,
  }))
  return {
    ...defaultConfig,
    resultList: defaultConfig.resultList,
    searchField: defaultConfig.searchField,
    filters: filters,
  }
}
// CustomAggregationQueries are currently only used for the license field to be able to use groups for licenses
function getCustomAggregationQuery(
  fieldName,
  groupingConfigs,
  collectOthersInSeparateGroup,
  showMissing
) {
  let aggsScript = "if (doc['" + fieldName + "'].size()==0) { return null }"
  const aggsScriptEntry = (groupingConfig) => {
    return (
      " else if (doc['" +
      fieldName +
      "'].value?.toLowerCase() =~ /" +
      groupingConfig.regex.toLowerCase().replaceAll("/", "\\/") +
      "/) { return '" +
      groupingConfig.id +
      "'}"
    )
  }
  aggsScript += groupingConfigs.reduce(
    (result, groupingConfig) => result + aggsScriptEntry(groupingConfig),
    ""
  )
  if (collectOthersInSeparateGroup) {
    aggsScript += " else { return 'OTHER' }"
  } else {
    aggsScript += " else { return doc['" + fieldName + "'] }"
  }
  const aggsQuery = {
    terms: {
      size: 100,
      script: {
        source: aggsScript,
        lang: "painless",
      },
    },
  }
  if (showMissing) {
    aggsQuery["terms"]["missing"] = "N/A"
  }
  return () => aggsQuery
}
function getCustomSelectFacetValueQuery(
  fieldName,
  groupingConfigs,
  collectOthersInSeparateGroup,
  showMissing
) {
  const getGroupSearch = (v) => {
    if (showMissing && v === "N/A") {
      return {bool: {must_not: {exists: {field: fieldName}}}}
    }
    const config = groupingConfigs.find((c) => c.id === v)
    if (!config && collectOthersInSeparateGroup) {
      return {
        bool: {
          must: {exists: {field: fieldName}},
          must_not: groupingConfigs.map((c) => ({
            regexp: {[fieldName]: {value: c.regex}},
          })),
        },
      }
    }
    return {
      regexp: {
        [fieldName]: {
          value: config ? config.regex : v,
        },
      },
    }
  }
  return (field, value) => {
    return getGroupSearch(value)
  }
}
export function getSearchkitRouting(
  searchIndexName,
  searchConfiguration,
  defaultPageSize
) {
  return {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[searchIndexName]
        let routeState = {
          search: indexUiState.query,
        }
        routeState = searchConfiguration.filters.reduce((acc, filter) => {
          if (filter.type === "switch") {
            acc[filter.componentId] = indexUiState.toggle?.[filter.componentId]
          } else {
            acc[filter.componentId] =
              indexUiState.refinementList?.[filter.componentId]
          }
          return acc
        }, routeState)
        if (
          indexUiState.hitsPerPage &&
          indexUiState.hitsPerPage !== defaultPageSize
        ) {
          routeState.size = indexUiState.hitsPerPage
        }
        if (indexUiState.page) {
          routeState.page = indexUiState.page
        }
        return routeState
      },
      routeToState(routeState) {
        const refinementList = searchConfiguration.filters
          .filter((filter) => filter.type !== "switch")
          .reduce((acc, filter) => {
            acc[filter.componentId] = routeState[filter.componentId]
            return acc
          }, {})
        const toggle = searchConfiguration.filters
          .filter((filter) => filter.type === "switch")
          .reduce((acc, filter) => {
            acc[filter.componentId] = routeState[filter.componentId]
            return acc
          }, {})
        return {
          [searchIndexName]: {
            query: routeState.search,
            refinementList: refinementList,
            toggle: toggle,
            hitsPerPage: routeState.size,
            page: routeState.page,
          },
        }
      },
    },
    router: history({
      cleanUrlOnDispose: false,
      createURL({qsModule, routeState, location}) {
        const searchParams = new URLSearchParams(location.search)
        Object.keys(routeState).forEach((key) => {
          searchParams.delete(key)
          if (routeState[key] !== undefined) {
            searchParams.set(key, encode(routeState[key]))
          }
        })
        if (!routeState.size) {
          searchParams.delete("size")
        }
        if (!routeState.page) {
          searchParams.delete("page")
        }
        const newSearch = searchParams.toString()
        return (
          location.origin +
          location.pathname +
          (newSearch ? "?" + newSearch : newSearch)
        )
      },
      parseURL({qsModule, location}) {
        const routeState = {}
        const searchParams = new URLSearchParams(location.search)
        searchParams.keys().forEach((key) => {
          const value = searchParams.get(key)
          try {
            routeState[key] = decode(value)
          } catch (e) {
            // Do not set value if JSON parsing fails.
            console.warn(`Failed to decode value for key "${key}":`, e)
          }
        })
        return routeState
      },
    }),
  }
}
function encode(value) {
  return JSON.stringify(value)
}
function decode(value) {
  return JSON.parse(value)
}

export default prepareSearchConfiguration
