import prepareSearchConfiguration from "../../config/SearchConfiguration"

export function getDefaultSearchConfiguration() {
  return prepareSearchConfiguration({
    search: {
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
    },
  })
}
export const defaultLicenseGrouping = [
  {
    regex: "https?://creativecommons.org/licenses/by/.*",
    id: "https://creativecommons.org/licenses/by/",
    groupValue: "BY",
  },
  {
    regex: "https?://creativecommons.org/licenses/by-sa/.*",
    id: "https://creativecommons.org/licenses/by-sa/",
    groupValue: "BY-SA",
  },
  {
    regex: "https?://creativecommons.org/licenses/by-nd/.*",
    id: "https://creativecommons.org/licenses/by-nd/",
    groupValue: "BY-ND",
  },
  {
    regex: "https?://creativecommons.org/licenses/by-nc-sa/.*",
    id: "https://creativecommons.org/licenses/by-nc-sa/",
    groupValue: "BY-NC-SA",
  },
  {
    regex: "https?://creativecommons.org/licenses/by-nc/.*",
    id: "https://creativecommons.org/licenses/by-nc/",
    groupValue: "BY-NC",
  },
  {
    regex: "https?://creativecommons.org/licenses/by-nc-nd/.*",
    id: "https://creativecommons.org/licenses/by-nc-nd/",
    groupValue: "BY-NC-ND",
  },
  {
    regex: "https?://creativecommons.org/publicdomain/zero/.*",
    id: "https://creativecommons.org/publicdomain/zero/",
    groupValue: "ZERO",
  },
  {
    regex: "https?://creativecommons.org/publicdomain/mark/.*",
    id: "https://creativecommons.org/publicdomain/mark/",
    groupValue: "PDM",
  },
  {
    regex: "https?://(www.)?opensource.org/licenses?/(MIT|mit)",
    id: "https://opensource.org/licenses/mit",
    groupValue: "MIT",
  },
  {
    regex: "https?://www.apache.org/licenses/.*",
    id: "https://www.apache.org/licenses/",
    groupValue: "Apache",
  },
  {
    regex: "https?://(www.)?opensource.org/licenses?/0?[bB][sS][dD].*",
    id: "https://opensource.org/licenses/bsd",
    groupValue: "BSD",
  },
  {
    regex: "https?://www.gnu.org/licenses/[al]?gpl.*",
    id: "https://www.gnu.org/licenses/gpl",
    groupValue: "GPL",
  },
  {
    regex: "https?://www.gnu.org/licenses/fdl.*",
    id: "https://www.gnu.org/licenses/fdl",
    groupValue: "FDL",
  },
]
