export default {
  name: "production",
  resultList: {
    component: "results",
    dataField: "name",
    stream: true,
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: null,
    loader: "Fetching Data ........",
    pagesShow: 5,
    sizeShow: 5,
    URLParams: true,
    showEndPage: true,
    and: [
      "author",
      "license",
      "search",
      "provider",
      "learningResourceType",
      "language",
      "about",
      "sourceOrganization",
      "keywordsComponent",
    ],
    sortByDynamic: null,
  },
  searchComponent: {
    component: "search",
    dataField: ["name", "creator.name", "description"],
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
    and: [
      "author",
      "license",
      "provider",
      "results",
      "learningResourceType",
      "language",
      "about",
      "sourceOrganization",
      "keywordsComponent",
    ],
  },
  multiList: [
    {
      component: "about",
      dataField: "about.id",
      title: "about",
      placeholder: "about",
      filterLabel: "about",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      size: 1000,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
        "sourceOrganization",
        "keywordsComponent",
      ],
    },
    {
      component: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "resourceType",
      placeholder: "resourceType",
      filterLabel: "resourceType",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "sourceOrganization",
        "about",
        "keywordsComponent",
      ],
    },
    {
      component: "license",
      dataField: "license",
      title: "license",
      placeholder: "license",
      filterLabel: "license",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "license-card",
      fontAwesome: "",
      URLParams: true,
      customQuery: (value, props) => {
        return value instanceof Array
          ? {
              query: {
                bool: {
                  should: value.map((v) => ({
                    prefix: {
                      license: v,
                    },
                  })),
                },
              },
            }
          : {}
      },
      defaultQuery: getPrefixAggregationQuery("license", [
        "https://creativecommons.org/licenses/by/",
        "https://creativecommons.org/licenses/by-sa/",
        "https://creativecommons.org/licenses/by-nd/",
        "https://creativecommons.org/licenses/by-nc-sa/",
        "https://creativecommons.org/licenses/by-nc/",
        "https://creativecommons.org/licenses/by-nc-nd/",
        "https://creativecommons.org/licenses/publicdomain/zero/",
        "https://creativecommons.org/publicdomain/mark",
      ]),
      and: [
        "author",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "language",
        "about",
        "sourceOrganization",
        "keywordsComponent",
      ],
    },
    {
      component: "author",
      dataField: "creator.name.keyword",
      nestedField: "",
      title: "author",
      placeholder: "author",
      filterLabel: "author",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showSearch: true,
      showFilter: true,
      size: 1000,
      className: "author-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "license",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "language",
        "about",
        "sourceOrganization",
        "keywordsComponent",
      ],
    },
    {
      component: "sourceOrganization",
      dataField: "sourceOrganization.name",
      title: "organization",
      placeholder: "organization",
      filterLabel: "organization",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
        "about",
        "keywordsComponent",
      ],
    },
    {
      component: "language",
      dataField: "inLanguage",
      title: "language",
      placeholder: "language",
      filterLabel: "language",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "language-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "about",
        "sourceOrganization",
        "keywordsComponent",
      ],
    },
    {
      component: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "provider",
      placeholder: "provider",
      filterLabel: "provider",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "sourse-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "results",
        "learningResourceType",
        "language",
        "about",
        "sourceOrganization",
        "keywordsComponent",
      ],
    },
    {
      component: "keywordsComponent",
      dataField: "keywords",
      title: "Keywords",
      placeholder: "Keywords",
      filterLabel: "Keywords",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "keywords-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
        "about",
        "sourceOrganization",
      ],
    },
  ],
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
      "')) { return '" +
      prefix +
      "'}",
    ""
  )
  aggsScript += " else { return doc['" + fieldName + "'] }"
  return () => ({
    aggs: {
      license: {
        terms: {
          script: {
            source: aggsScript,
            lang: "painless",
          },
        },
      },
    },
  })
}
