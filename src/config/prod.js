const prod = enrichDefaultConfig({
  name: "production",
  resultList: {
    componentId: "results",
    dataField: "name",
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: null,
    pagesShow: 5,
    sizeShow: 5,
    URLParams: true,
    showEndPage: true,
    sortByDynamic: null,
  },
  searchComponent: {
    componentId: "search",
    dataField: ["name", "creator.name", "description", "keywords"],
    fieldWeights: [1, 3],
    queryFormat: "and",
    fuzziness: 0,
    debounce: 100,
    autosuggest: true,
    highlight: true,
    highlightField: "keywords",
    iconPosition: "right",
    showFilter: true,
    URLParams: true,
  },
  multiList: [
    {
      componentId: "about",
      dataField: "about.id",
      title: "about",
      placeholder: "about",
      filterLabel: "about",
      showMissing: true,
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "about-card",
      URLParams: true,
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      componentId: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "resourceType",
      placeholder: "resourceType",
      filterLabel: "resourceType",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "lrt-card",
      URLParams: true,
    },
    {
      componentId: "license",
      dataField: "license.id",
      title: "license",
      placeholder: "license",
      filterLabel: "license",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "license-card",
      URLParams: true,
      customQuery: (value, props) => {
        return value instanceof Array
          ? {
              query: {
                bool: {
                  should: [
                    ...value.map((v) => ({
                      prefix: {
                        "license.id": v,
                      },
                    })),
                    ...value.map((v) => ({
                      prefix: {
                        "license.id": v.replace("https:/", "http:/"),
                      },
                    })),
                  ],
                },
              },
            }
          : {}
      },
      defaultQuery: getPrefixAggregationQuery("license.id", [
        "https://creativecommons.org/licenses/by/",
        "https://creativecommons.org/licenses/by-sa/",
        "https://creativecommons.org/licenses/by-nd/",
        "https://creativecommons.org/licenses/by-nc-sa/",
        "https://creativecommons.org/licenses/by-nc/",
        "https://creativecommons.org/licenses/by-nc-nd/",
        "https://creativecommons.org/publicdomain/zero/",
        "https://creativecommons.org/publicdomain/mark",
        "https://www.apache.org/licenses/LICENSE-2.0",
        "https://www.gnu.org/licenses/fdl",
      ]),
    },
    {
      componentId: "author",
      dataField: "persons.name.keyword",
      title: "author",
      placeholder: "author",
      filterLabel: "author",
      showMissing: true,
      showSearch: true,
      showFilter: true,
      size: 1000,
      className: "author-card",
      URLParams: true,
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      componentId: "sourceOrganization",
      dataField: "institutions.name",
      title: "organization",
      placeholder: "organization",
      filterLabel: "organization",
      showMissing: true,
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "source-type-card",
      URLParams: true,
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      componentId: "language",
      dataField: "inLanguage",
      title: "language",
      placeholder: "language",
      filterLabel: "language",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "language-card",
      URLParams: true,
    },
    {
      componentId: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "provider",
      placeholder: "provider",
      filterLabel: "provider",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "provider-card",
      URLParams: true,
    },
  ],
  switchList: [
    {
      componentId: "conditionsOfAccess",
      dataField: "conditionsOfAccess.id",
      filterLabel: "CONDITIONS_OF_ACCESS",
      switchableFieldValue: "http://w3id.org/kim/conditionsOfAccess/no_login",
      defaultChecked: false,
    },
  ],
})
function enrichDefaultConfig(defaultConfig) {
  const allComponentIds = [
    defaultConfig.resultList.componentId,
    defaultConfig.searchComponent.componentId,
  ]
    .concat(defaultConfig.multiList.map((e) => e.componentId))
    .concat(defaultConfig.switchList.map((e) => e.componentId))
  const addReact = (component) => {
    return {
      ...component,
      react: {and: allComponentIds.filter((id) => id !== component.componentId)},
    }
  }
  return {
    ...defaultConfig,
    resultList: addReact(defaultConfig.resultList),
    searchComponent: addReact(defaultConfig.searchComponent),
    multiList: defaultConfig.multiList.map(addReact),
    switchList: defaultConfig.switchList.map(addReact),
  }
}
function getPrefixAggregationQuery(fieldName, prefixList) {
  var aggsScript = "if (doc['" + fieldName + "'].size()==0) { return null }"
  aggsScript += prefixList.reduce(
    (result, prefix) =>
      result +
      " else if (doc['" +
      fieldName +
      "'].value.startsWith('" +
      prefix +
      "') || doc['" +
      fieldName +
      "'].value.startsWith('" +
      prefix.replace("https:/", "http:/") +
      "')) { return '" +
      prefix +
      "'}",
    ""
  )
  aggsScript += " else { return doc['" + fieldName + "'] }"
  return () => ({
    aggs: {
      "license.id": {
        terms: {
          size: 100,
          script: {
            source: aggsScript,
            lang: "painless",
          },
        },
      },
    },
  })
}
export default prod
