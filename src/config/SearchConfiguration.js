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
        ...getCustomAggregationQueries(component.dataField, fieldOptions?.grouping),
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
// PrefixAggregationQueries are currently only used for the license field to be able to use groups for licenses
function getCustomAggregationQueries(fieldName, groupingConfigs) {
  let aggsScript = "if (doc['" + fieldName + "'].size()==0) { return null }"
  const aggsScriptEntry = (groupingConfig) => {
    return (
      " else if (doc['" +
      fieldName +
      "'].value =~ /" +
      groupingConfig.regex.replaceAll("/", "\\/") +
      "/) { return '" +
      groupingConfig.id +
      "'}"
    )
  }
  const getGroupSearch = (v) => {
    const config = groupingConfigs.find((c) => c.id === v)
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
  aggsScript += " else { return doc['" + fieldName + "'] }"
  return {
    defaultQuery: () => ({
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
    }),
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
