const prod = {
  name: "production",
  resultList: {
    component: "results",
    dataField: "name",
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: null,
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
      "conditionsOfAccess",
    ],
    sortByDynamic: null,
  },
  searchComponent: {
    component: "search",
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
    and: [
      "author",
      "license",
      "provider",
      "results",
      "learningResourceType",
      "language",
      "about",
      "sourceOrganization",
      "conditionsOfAccess",
    ],
  },
  multiList: [
    {
      component: "about",
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
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
        "sourceOrganization",
        "conditionsOfAccess",
      ],
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      component: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "resourceType",
      placeholder: "resourceType",
      filterLabel: "resourceType",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "lrt-card",
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
        "conditionsOfAccess",
      ],
    },
    {
      component: "license",
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
        "conditionsOfAccess",
      ],
    },
    {
      component: "author",
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
      and: [
        "license",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "language",
        "about",
        "sourceOrganization",
        "conditionsOfAccess",
      ],
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      component: "sourceOrganization",
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
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
        "about",
        "conditionsOfAccess",
      ],
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
    },
    {
      component: "language",
      dataField: "inLanguage",
      title: "language",
      placeholder: "language",
      filterLabel: "language",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "language-card",
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
        "conditionsOfAccess",
      ],
    },
    {
      component: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "provider",
      placeholder: "provider",
      filterLabel: "provider",
      showMissing: true,
      showFilter: true,
      showSearch: false,
      className: "provider-card",
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
        "conditionsOfAccess",
      ],
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
