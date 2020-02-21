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
    ],
    sortByDynamic: [
      {
        dataField: "name.keyword",
        sortBy: "asc",
        label: "Sort by Name(A-Z) \u00A0"
      },
      {
        dataField: "name.keyword",
        sortBy: "desc",
        label: "Sort by Name(Z-A)\u00A0 \u00A0"
      },
      {
        dataField: "author.keyword",
        sortBy: "desc",
        label: "Sort by Author(Z-A) \u00A0"
      },
      {
        dataField: "author.keyword",
        sortBy: "asc",
        label: "Sort by Author(A-Z) \u00A0"
      }
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
      title: "Autor",
      placeholder: "Autor",
      filterLabel: "Autor",
      showSearch: true,
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
      title: "Lizenz",
      placeholder: "Lizenz",
      filterLabel: "Lizenz",
      showFilter: true,
      showSearch: false,
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
      title: "Quelle",
      placeholder: "Quelle",
      filterLabel: "Quelle",
      showFilter: true,
      showSearch: false,
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
      title: "Sprache",
      placeholder: "Sprache",
      filterLabel: "Sprache",
      showFilter: true,
      showSearch: false,
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
      title: "Material",
      placeholder: "Material",
      filterLabel: "Material",
      showFilter: true,
      showSearch: false,
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
