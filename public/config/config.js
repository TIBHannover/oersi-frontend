window['runTimeConfig'] = {
  ELASTIC_SEARCH: {
    URL: "http://localhost:9200/",
    CREDENCIAL: "",
    APP_NAME: "oer_data"
  },
  GENERAL_CONFIGURATION:{
    RESULT_PAGE_SIZE_OPTIONS:["5", "10", "15", "20", "50", "100"],  // page size options configuration    
    NR_OF_RESULT_PER_PAGE:10,  //  number of results to show per view. Defaults to 10.
    /**
     * Accept a list of objects 
     * example:
     * {'path': 'public/{folderName}/{languageCode}/{fileName}.html', 'language': '{languageCode}'}
     * 
     */
    PRIVACY_POLICY_LINK: [],
    I18N_CACHE_EXPIRATION: 600000 // expiration time of the i18n translation cache storage
  }  

}