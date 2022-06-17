import React from "react"
import {DataSearch, MultiList, ReactiveList} from "@appbaseio/reactivesearch"

export default {
  datasearch: {
    className: "search",
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
    URLParams: true,
    react: {
      and: [
        "about",
        "author",
        "language",
        "learningResourceType",
        "license",
        "provider",
        "sourceOrganization",
      ],
    },
    source: DataSearch,
  },
  resultcard: {
    className: "right-col",
    componentId: "results",
    dataField: "name",
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: null,
    sortOptions: null,
    pages: 5,
    sizeShow: 5,
    URLParams: true,
    showEndPage: true,
    react: {
      and: [
        "about",
        "author",
        "language",
        "learningResourceType",
        "license",
        "provider",
        "search",
        "sourceOrganization",
      ],
    },
    innerClass: {
      resultStats: "result-stats",
      list: "list",
      listItem: "list-item",
      image: "image",
    },
    source: ReactiveList,
  },
  multiList: [
    {
      componentId: "about",
      key: "about",
      dataField: "about.id",
      title: "about",
      placeholder: "about",
      filterLabel: "ABOUT",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "about-card",
      URLParams: true,
      react: {
        and: [
          "author",
          "language",
          "learningResourceType",
          "license",
          "provider",
          "search",
          "sourceOrganization",
        ],
      },
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      source: MultiList,
    },
    {
      componentId: "learningResourceType",
      key: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "resourceType",
      placeholder: "resourceType",
      filterLabel: "RESOURCETYPE",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "lrt-card",
      URLParams: true,
      react: {
        and: [
          "about",
          "author",
          "language",
          "license",
          "provider",
          "search",
          "sourceOrganization",
        ],
      },
      source: MultiList,
    },
    {
      componentId: "license",
      key: "license",
      dataField: "license.id",
      title: "license",
      placeholder: "license",
      filterLabel: "LICENSE",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
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
      react: {
        and: [
          "about",
          "author",
          "language",
          "learningResourceType",
          "provider",
          "search",
          "sourceOrganization",
        ],
      },
      source: MultiList,
    },
    {
      componentId: "author",
      key: "author",
      dataField: "persons.name.keyword",
      title: "author",
      placeholder: "author",
      filterLabel: "AUTHOR",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showSearch: true,
      showFilter: true,
      size: 1000,
      className: "author-card",
      URLParams: true,
      react: {
        and: [
          "about",
          "language",
          "learningResourceType",
          "license",
          "provider",
          "search",
          "sourceOrganization",
        ],
      },
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      source: MultiList,
    },
    {
      componentId: "sourceOrganization",
      key: "sourceOrganization",
      dataField: "institutions.name",
      title: "organization",
      placeholder: "organization",
      filterLabel: "ORGANIZATION",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: true,
      size: 1000,
      className: "source-type-card",
      URLParams: true,
      react: {
        and: [
          "author",
          "license",
          "search",
          "provider",
          "language",
          "learningResourceType",
          "about",
        ],
      },
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      source: MultiList,
    },
    {
      componentId: "language",
      key: "language",
      dataField: "inLanguage",
      title: "language",
      placeholder: "language",
      filterLabel: "LANGUAGE",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "language-card",
      URLParams: true,
      react: {
        and: [
          "author",
          "license",
          "search",
          "provider",
          "learningResourceType",
          "about",
          "sourceOrganization",
        ],
      },
      source: MultiList,
    },
    {
      componentId: "provider",
      key: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "provider",
      placeholder: "provider",
      filterLabel: "PROVIDER",
      queryFormat: "or",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "provider-card",
      URLParams: true,
      react: {
        and: [
          "author",
          "license",
          "search",
          "learningResourceType",
          "language",
          "about",
          "sourceOrganization",
        ],
      },
      source: MultiList,
    },
  ],
}

function getPrefixAggregationQuery(fieldName, prefixList) {
  let aggsScript = "if (doc['" + fieldName + "'].size()==0) { return null }"
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
