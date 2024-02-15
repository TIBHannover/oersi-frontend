function prepareSearchConfiguration(searchConfig) {
  return enrichDefaultConfig({
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
  })
}
function enrichDefaultConfig(defaultConfig) {
  const allComponentIds = [
    defaultConfig.resultList.componentId,
    defaultConfig.searchField.componentId,
  ].concat(defaultConfig.filters.map((e) => e.componentId))
  const addReact = (component) => {
    return {
      ...component,
      react: {and: allComponentIds.filter((id) => id !== component.componentId)},
    }
  }
  const addCustomQuery = (component) => {
    if (component.prefixAggregationQueryPrefixes) {
      return {
        ...component,
        ...getPrefixAggregationQueries(
          component.dataField,
          component.prefixAggregationQueryPrefixes,
          component.prefixAggregationQueryAdditions
        ),
      }
    }
    return component
  }
  return {
    ...defaultConfig,
    resultList: addReact(defaultConfig.resultList),
    searchField: addReact(defaultConfig.searchField),
    filters: defaultConfig.filters.map(addReact).map(addCustomQuery),
  }
}
// PrefixAggregationQueries are currently only used for the license field to be able to use groups for licenses
function getPrefixAggregationQueries(fieldName, prefixList, prefixAdditions) {
  let aggsScript = "if (doc['" + fieldName + "'].size()==0) { return null }"
  const aggsScriptEntry = (prefix) => {
    return (
      " else if (doc['" +
      fieldName +
      "'].value.startsWith('" +
      prefix +
      "') " +
      prefixAdditions
        .map(
          (a) =>
            "|| doc['" +
            fieldName +
            "'].value.startsWith('" +
            prefix.replace(a.value, a.replacement) +
            "')"
        )
        .join(" ") +
      ") { return '" +
      prefix +
      "'}"
    )
  }

  aggsScript += prefixList.reduce(
    (result, prefix) => result + aggsScriptEntry(prefix),
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
                should: [
                  ...value.map((v) => ({
                    prefix: {
                      [fieldName]: v,
                    },
                  })),
                  ...prefixAdditions
                    .map((addition) => {
                      return value.map((v) => ({
                        prefix: {
                          [fieldName]: v.replace(
                            addition.value,
                            addition.replacement
                          ),
                        },
                      }))
                    })
                    .flat(),
                ],
              },
            },
          }
        : {}
    },
  }
}
export default prepareSearchConfiguration
