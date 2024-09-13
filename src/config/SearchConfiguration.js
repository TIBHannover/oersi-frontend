function prepareSearchConfiguration(oersiConfig) {
  const searchConfig = oersiConfig.search
  const fieldsOptions = oersiConfig.fieldConfiguration?.options
  return enrichDefaultConfig(
    {
      resultList: {
        componentId: "results",
        pagination: true,
        paginationAt: "bottom",
        ...searchConfig.resultList,
      },
      searchField: {
        componentId: "search",
        iconPosition: "right",
        ...searchConfig.searchField,
      },
      filters: searchConfig.filters,
    },
    fieldsOptions
  )
}
function enrichDefaultConfig(defaultConfig, fieldsOptions) {
  const filters = defaultConfig.filters.map((e) => ({
    componentId: e.dataField,
    ...e,
  }))
  const allComponentIds = [
    defaultConfig.resultList.componentId,
    defaultConfig.searchField.componentId,
  ].concat(filters.map((e) => e.componentId))
  const addReact = (component) => {
    return {
      ...component,
      react: {and: allComponentIds.filter((id) => id !== component.componentId)},
    }
  }
  const addCustomQuery = (component) => {
    const fieldOptions = fieldsOptions?.find(
      (e) => e.dataField === component.dataField
    )
    if (fieldOptions?.grouping) {
      return {
        ...component,
        ...getCustomAggregationQueries(
          component.dataField,
          fieldOptions?.grouping,
          fieldOptions?.collectOthersInSeparateGroup,
          component.showMissing
        ),
      }
    }
    return component
  }
  return {
    ...defaultConfig,
    resultList: addReact(defaultConfig.resultList),
    searchField: addReact(defaultConfig.searchField),
    filters: filters.map(addReact).map(addCustomQuery),
  }
}
// CustomAggregationQueries are currently only used for the license field to be able to use groups for licenses
function getCustomAggregationQueries(
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
    aggs: {
      [fieldName]: {
        terms: {
          size: 100,
          script: {
            source: aggsScript,
            lang: "painless",
          },
        },
      },
    },
  }
  if (showMissing) {
    aggsQuery["aggs"][fieldName]["terms"]["missing"] = "N/A"
  }
  return {
    defaultQuery: () => aggsQuery,
    customQuery: (value, props) => {
      return value instanceof Array
        ? {
            query: {
              bool: {
                should: [...value.map((v) => getGroupSearch(v))],
              },
            },
          }
        : {}
    },
  }
}
export default prepareSearchConfiguration
