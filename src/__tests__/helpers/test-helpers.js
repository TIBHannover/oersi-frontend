import prepareSearchConfiguration from "../../config/SearchConfiguration"

export function getDefaultSearchConfiguration() {
  return prepareSearchConfiguration({
    resultList: {},
    searchField: {
      dataField: [
        "name",
        "creator.name",
        "description",
        "keywords",
        "about.prefLabel_full",
        "learningResourceType.prefLabel_full",
      ],
      fieldWeights: [1, 3],
      fuzziness: 0,
      debounce: 100,
    },
    filters: [
      {
        componentId: "about",
        dataField: "about.id",
        showSearch: true,
        size: 1000,
        allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      },
      {
        componentId: "learningResourceType",
        dataField: "learningResourceType.id",
      },
      {
        componentId: "license",
        dataField: "license.id",
        prefixAggregationQueryAdditions: [{value: "https:/", replacement: "http:/"}],
        prefixAggregationQueryPrefixes: [
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
          "https://www.gnu.org/licenses/gpl",
        ],
      },
      {
        componentId: "author",
        dataField: "persons.name.keyword",
        labelKey: "creator.name",
        showSearch: true,
        size: 1000,
        allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      },
      {
        componentId: "sourceOrganization",
        dataField: "institutions.name",
        labelKey: "sourceOrganization.name",
        showSearch: true,
        size: 1000,
        allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      },
      {
        componentId: "language",
        dataField: "inLanguage",
      },
      {
        componentId: "provider",
        dataField: "mainEntityOfPage.provider.name",
        showSearch: true,
      },
      {
        type: "switch",
        componentId: "conditionsOfAccess",
        dataField: "conditionsOfAccess.id",
        switchableFieldValue: "http://w3id.org/kim/conditionsOfAccess/no_login",
        defaultChecked: false,
      },
    ],
  })
}
