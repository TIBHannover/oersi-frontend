window['runTimeConfig'] = {
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
    RESULT_PAGE_SIZE_OPTIONS:["12", "24", "48", "96"],  // page size options configuration
    NR_OF_RESULT_PER_PAGE:12,  //  number of results to show per view. Defaults to 12.
    HEADER_LOGO_URL: "",  // if set, use this URL for the logo in the header and include your custom svg or similar; default is "logo-192.png". You may use placeholders {{dark}} and {{small}} to use different logo-versions for dark/mobile mode (they will be replaced by "_dark" and "_small").
    THEME_COLORS: null,  // customize colors of the theme; format: {primary: {main: "#000"}, secondary: {main: "#000"}}
    THEME_COLORS_DARK: null,  // customize colors of the dark theme; format: {primary: {main: "#000"}, secondary: {main: "#000"}}
    /**
     * Accept a list of objects
     * example:
     * {'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': '{languageCode}'}
     *
     */
    PRIVACY_POLICY_LINK: [{'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': 'de'}],
    EXTERNAL_INFO_LINK: {
      // if set, a link to this url is used in the header; format: lng-code -> url
      //en: "https://oersi.org/resources/pages/en",
    },
    I18N_CACHE_EXPIRATION: 600000, // expiration time of the i18n translation cache storage
    I18N_DEBUG: false,
    TRACK_TOTAL_HITS: true, // track number of total hits from elasticsearch - see https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-your-data.html#track-total-hits
    HIERARCHICAL_FILTERS: [{componentId: "about", schemeParentMap: "/vocabs/hochschulfaechersystematik-parentMap.json"}],
    AGGREGATION_SEARCH_COMPONENTS: ["author"], // filters/components that should update the aggregation on typing in the search field
    AGGREGATION_SEARCH_DEBOUNCE: 200, // sets the milliseconds to wait before executing an aggregation search (search inside filters)
    AGGREGATION_SEARCH_MIN_LENGTH: 3, // minimum length of search term in aggregation search (search inside filters)
    FEATURES: {
      DARK_MODE: true,
      CHANGE_FONTSIZE: false, // experimental/beta - just to show weaknesses in styling
      EMBED_OER: true, // feature toggle: use "embed" button
      OERSI_THUMBNAILS: true, // feature toggle: use thumbnails from OERSI-thumbnail-generator for resource-preview-images with image-url as fallback
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
          prefixAggregationQueryAdditions: [
            {value: "https:/", replacement: "http:/"},
          ],
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
          dataField: "creator.name.keyword",
          labelKey: "creator.name",
          showSearch: true,
          size: 1000,
          allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
        },
        {
          componentId: "sourceOrganization",
          dataField: "sourceOrganization.name",
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
