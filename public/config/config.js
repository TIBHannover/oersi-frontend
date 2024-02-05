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
    ENABLED_FILTERS: ["about", "learningResourceType", "license", "author", "sourceOrganization", "language", "provider", "conditionsOfAccess"],
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
          dataField: "inLanguage",
          translationNamespace: "language",
        },
        {
          dataField: "learningResourceType.id",
          translationNamespace: "labelledConcept",
        },
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
