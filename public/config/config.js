const licenseGrouping = [
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
    regex: "https?://www.gnu.org/licenses(/old-licenses)?/[al]?gpl.*",
    id: "https://www.gnu.org/licenses/gpl",
    groupValue: "GPL",
  },
  {
    regex: "https?://www.gnu.org/licenses/fdl.*",
    id: "https://www.gnu.org/licenses/fdl",
    groupValue: "FDL",
  },
  {
    regex: "https?://opendatacommons.org/licenses/odbl/.*",
    id: "https://opendatacommons.org/licenses/odbl/",
    groupValue: "ODbL",
  },
  {
    regex: "https?://opensource.org/licenses?/Artistic.*",
    id: "https://opensource.org/license/Artistic",
    groupValue: "Artistic",
  },
  {
    regex: "https?://opendatacommons.org/licenses/pddl/.*",
    id: "https://opendatacommons.org/licenses/pddl/",
    groupValue: "PDDL",
  },
  {
    regex: "https?://opendatacommons.org/licenses/by/.*",
    id: "https://opendatacommons.org/licenses/by/",
    groupValue: "ODC-By",
  },
  {
    regex: "https?://rightsstatements.org/(page|vocab)/InC/.*",
    id: "https://rightsstatements.org/page/InC/",
    groupValue: "InC",
  },
]

window["runTimeConfig"] = {
  BACKEND_API: {
    BASE_URL: "https://your.oersi.instance.org",
    PATH_CONTACT: "/resources/api-internal/contact",
    PATH_LABEL: "/resources/api-internal/label",
    PATH_SEARCH: "/resources/api/search"
  },
  ELASTIC_SEARCH_INDEX_NAME: "oer_data",
  GENERAL_CONFIGURATION:{
    AVAILABLE_LANGUAGES: ["de", "en"],
    PUBLIC_URL: "http://localhost/resources",
    RESULT_PAGE_SIZE_OPTIONS: ["12", "24", "48", "96"], // page size options configuration
    NR_OF_RESULT_PER_PAGE: 12, //  number of results to show per view. Defaults to 12.
    HEADER_LOGO_URL: "", // if set, use this URL for the logo in the header and include your custom svg or similar; default is "logo-192.png". You may use placeholders {{dark}} and {{small}} to use different logo-versions for dark/mobile mode (they will be replaced by "_dark" and "_small").
    DEFAULT_SOCIAL_MEDIA_IMAGE: null,
    /**
     * Accept a list of objects
     * example:
     * {'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': '{languageCode}'}
     *
     */
    PRIVACY_POLICY_LINK: [
      {path: "public/{folderName}/{languageCode}/{fileName}.html", language: "de"},
    ],
    ADDITIONAL_NAV_LINKS: [
      // {
      //   en: {label: "Info", url: "https://oersi.org/resources/pages/en/"},
      //   de: {label: "Info", url: "https://oersi.org/resources/pages/de/"},
      // },
    ],
    I18N_CACHE_EXPIRATION: 600000, // expiration time of the i18n translation cache storage
    I18N_DEBUG: false,
    TRACK_TOTAL_HITS: true, // track number of total hits from elasticsearch - see https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-your-data.html#track-total-hits
    FEATURES: {
      DARK_MODE: true,
      RESOURCE_EMBEDDING_SNIPPET: true, // feature toggle: use "embed" button
      SIDRE_THUMBNAILS: true, // feature toggle: use thumbnails from SIDRE-thumbnail-generator for resource-preview-images with image-url as fallback
      SCROLL_TOP_BUTTON: true, // feature toggle: use "scroll-to-top" button
    },
    fieldConfiguration: {
      baseFields: {
        title: "name",
        resourceLink: "id",
        description: "description",
        keywords: "keywords",
        licenseUrl: "license.id",
        author: "creator.name",
        thumbnailUrl: "image",
      },
      embedding: {
        mediaUrl: "trailer.embedUrl",
        fallbackMediaUrl: ["encoding.embedUrl"],
      },
      options: [
        {
          dataField: "about.id",
          isHierarchicalConcept: true,
          schemeParentMap: "/vocabs/hochschulfaechersystematik-parentMap.json",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "audience.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "conditionsOfAccess.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "inLanguage",
          translationNamespace: "language",
        },
        {
          dataField: "learningResourceType.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "license.id",
          defaultDisplayType: "licenseGroup",
          grouping: licenseGrouping,
          collectOthersInSeparateGroup: true,
        },
        {
          dataField: "name",
          multilingual: {
            languageSelectionType: "field", // field / map
            languageSelectionField: "language",
            valueField: "value",
          },
        },
      ],
    },
    embeddedStructuredDataAdjustments: [
      {fieldName: "@context", action: "replace", value: "https://schema.org/"},
      {fieldName: "about", action: "map", value: "id"},
      {fieldName: "conditionsOfAccess", action: "map", value: "id"},
      {fieldName: "learningResourceType", action: "map", value: "id"},
      {fieldName: "license", action: "map", value: "id"},
    ],
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
          showMissing: true,
        },
        {
          componentId: "author",
          dataField: "creator.name.keyword",
          labelKey: "creator.name",
          showSearch: true,
          reloadFilterOnSearchTermChange: true,
          reloadFilterDebounce: 300,
          reloadFilterMinSearchTermLength: 4,
          size: 1000,
          allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
        },
        {
          componentId: "sourceOrganization",
          dataField: "sourceOrganization.name",
          labelKey: "sourceOrganization.name",
          showSearch: true,
          reloadFilterOnSearchTermChange: true,
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
    resultCard: {
      title: {},
      subtitle: {field: "creator.name"},
      content: [
        {
          field: "description",
          maxLines: 4,
          bold: true,
          fallback: ["keywords"],
        },
        {field: "about.id"},
        {field: "learningResourceType.id"},
      ],
    },
    detailPage: {
      content: [
        {field: "creator.name"},
        {field: "description"},
        {field: "about.id"},
        {field: "learningResourceType.id"},
        {field: "sourceOrganization.name"},
        {field: "publisher.name"},
        {
          field: "datePublished",
          type: "date",
        },
        {field: "inLanguage"},
        {
          field: "hasPart",
          type: "nestedObjects",
          content: [
            {field: "name"},
            {field: "id", type: "link", externalLinkField: "id"},
          ],
        },
        {
          field: "keywords",
          type: "chips",
        },
        {
          field: "aggregateRating.ratingCount",
          type: "rating", // experimental
        },
        {
          field: "license.id",
          type: "license",
        },
        {field: "audience.id"},
        {
          field: "hasVersion.name",
          externalLinkField: "hasVersion.id",
          type: "link",
          multiItemsDisplay: "ul",
        },
        {
          field: "mainEntityOfPage.provider.name",
          externalLinkField: "mainEntityOfPage.id",
          type: "link",
        },
        {
          field: "encoding.contentUrl",
          formatField: "encoding.encodingFormat",
          sizeField: "encoding.contentSize",
          type: "fileLink", // experimental
        },
      ],
    },
  },
}
