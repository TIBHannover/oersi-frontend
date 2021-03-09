window['runTimeConfig'] = {
  ELASTIC_SEARCH: {
    URL: "http://localhost:9200/",
    CREDENTIALS: "",
    APP_NAME: "oer_data"
  },
  GENERAL_CONFIGURATION:{
    RESULT_PAGE_SIZE_OPTIONS:["12", "24", "48", "96"],  // page size options configuration    
    NR_OF_RESULT_PER_PAGE:12,  //  number of results to show per view. Defaults to 12.
    /**
     * Accept a list of objects 
     * example:
     * {'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': '{languageCode}'}
     * 
     */
    PRIVACY_POLICY_LINK: [],
    I18N_CACHE_EXPIRATION: 600000, // expiration time of the i18n translation cache storage
    TRACK_TOTAL_HITS: true, // track number of total hits from elasticsearch - see https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-your-data.html#track-total-hits
    FEATURES: {
      EMBED_OER: false // feature toggle: use "embed-oer" button
    },
    EMBED_MEDIA_MAPPING: [ // mappings from source url to embedding-code for media
      {
        regex: "https://av.tib.eu/media/([0-9]+)",
        html: (match) => `<iframe width="560" height="315" scrolling="no" src="//av.tib.eu/player/${match[1]}" frameborder="0" allowfullscreen></iframe>`
      },
      {
        regex: "https://(?:www.youtube.com/watch\\?v\\=|youtu.be/)([a-zA-Z0-9-_]+)",
        html: (match) => `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${match[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      }
    ]
  }
}