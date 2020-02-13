export default {
  name: "Development",
  ELASTIC_SEARCH: {
    URL: "http://192.168.98.115/es/",
    CREDENCIAL: "",
    APP_NAME: "oer_data"
  },
  resultList: {
    dataFiled: "name.keyword",
    stream: true,
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: "desc",
    loader: "Fetching Data ........",
    pagesShow: 5,
    sizeShow: 5
  }
};
