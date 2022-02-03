window['runTimeConfig'] = {
  ELASTIC_SEARCH: {
    URL: "http://localhost:9200/",
    CREDENTIALS: "",
    APP_NAME: "oer_data"
  },
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
    PRIVACY_POLICY_LINK: [],
    I18N_CACHE_EXPIRATION: 600000, // expiration time of the i18n translation cache storage
    I18N_DEBUG: false,
    TRACK_TOTAL_HITS: true, // track number of total hits from elasticsearch - see https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-your-data.html#track-total-hits
    FEATURES: {
      DARK_MODE: true,
      CHANGE_FONTSIZE: false,  // experimental/beta - just to show weaknesses in styling
      EMBED_OER: true, // feature toggle: use "embed-oer" button
      SCROLL_TOP_BUTTON: true // feature toggle: use "scroll-to-top" button
    }
  }
}