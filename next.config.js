const {i18n} = require("./next-i18next.config")

module.exports = (phase, {defaultConfig}) => {
  return {
    i18n: i18n,
    // TODO using this configuration or is it sufficient to use ".env"-configs?
    serverRuntimeConfig: {
      // Will only be available on the server side
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      // elasticSearch: {
      //   app: "oer_data",
      //   url: "http://192.168.98.115/resources/api-internal/search",
      // },
      GENERAL_CONFIGURATION: {
        AVAILABLE_LANGUAGES: ["de", "en"],
        PUBLIC_URL: "http://localhost/resources",
        RESULT_PAGE_SIZE_OPTIONS: ["12", "24", "48", "96"], // page size options configuration
        NR_OF_RESULT_PER_PAGE: 12, //  number of results to show per view. Defaults to 12.
        HEADER_LOGO_URL: "", // if set, use this URL for the logo in the header and include your custom svg or similar; default is "logo-192.png". You may use placeholders {{dark}} and {{small}} to use different logo-versions for dark/mobile mode (they will be replaced by "_dark" and "_small").
        THEME_COLORS: null, // customize colors of the theme; format: {primary: {main: "#000"}, secondary: {main: "#000"}}
        THEME_COLORS_DARK: null, // customize colors of the dark theme; format: {primary: {main: "#000"}, secondary: {main: "#000"}}
        /**
         * Accept a list of objects
         * example:
         * {'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': '{languageCode}'}
         *
         */
        PRIVACY_POLICY_LINK: [],
        EXTERNAL_INFO_LINK: {
          // if set, a link to this url is used in the header; format: lng-code -> url
          //en: "https://oersi.org/resources/pages/en/",
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
          EMBED_OER: true, // feature toggle: use "embed-oer" button
          OERSI_THUMBNAILS: true, // feature toggle: use thumbnails from OERSI-thumbnail-generator for resource-preview-images with image-url as fallback
          SCROLL_TOP_BUTTON: true, // feature toggle: use "scroll-to-top" button
        },
      },
    },
  }
}
