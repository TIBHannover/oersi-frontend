export default {
  name: "Development",
  ELASTIC_SEARCH: {
    URL: "http://192.168.98.115/es/",
    CREDENCIAL: "",
    APP_NAME: "oer_data"
  },
  resultList: {
    component: "SearchResult",
    dataFiled: "name.keyword",
    stream: true,
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: "desc",
    loader: "Fetching Data ........",
    pagesShow: 5,
    sizeShow: 5,
    and: [
      "AuthorFilter",
      "LicenseFilter",
      "Search",
      "sourceFilter",
      "learningresourcetypeFilter",
      "inlanguageFilter"
    ]
  },
  searchComponent: {
    component: "Search",
    placeholder: "Search for name , author , tags ",
    dataField: ["name", "author", "tags"],
    fieldWeights: [1, 3],
    queryFormat: "or",
    fuzziness: 0,
    debounce: 100,
    autosuggest: true,
    highlight: true,
    highlightField: "name",
    iconPosition: "right",
    showFilter: true,
    URLParams: false,
    and: [
      "AuthorFilter",
      "LicenseFilter",
      "Search",
      "sourceFilter",
      "learningresourcetypeFilter",
      "inlanguageFilter"
    ]
  },
  multiList: [
    {
      component: "AuthorFilter",
      dataField: "author.keyword",
      title: "Filter by Author",
      placeholder: "Filter Author",
      filterLabel: "Filter Author",
      showFilter: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter"
      ]
    },
    {
      component: "LicenseFilter",
      dataField: "license.keyword",
      title: "Filter by License",
      placeholder: "Filter License",
      filterLabel: "Filter License",
      showFilter: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter"
      ]
    },
    {
      component: "sourceFilter",
      dataField: "source.keyword",
      title: "Filter by Source",
      placeholder: "Filter Source",
      filterLabel: "Filter Source",
      showFilter: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter"
      ]
    },
    {
      component: "inlanguageFilter",
      dataField: "inlanguage.keyword",
      title: "Filter by Langauge",
      placeholder: "Filter Langauge",
      filterLabel: "Filter Langauge",
      showFilter: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter"
      ]
    },
    {
      component: "learningresourcetypeFilter",
      dataField: "learningresourcetype.keyword",
      title: "Filter by Type",
      placeholder: "Filter Type",
      filterLabel: "Filter Type",
      showFilter: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter"
      ]
    }
  ]
};
