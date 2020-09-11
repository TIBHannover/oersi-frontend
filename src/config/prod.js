export default {
  name: "production",
  resultList: {
    component: "results",
    dataField: "name",
    stream: true,
    pagination: true,
    showResultStats: true,
    paginationAt: "bottom",
    sortBy: null,
    loader: "Fetching Data ........",
    pagesShow: 5,
    sizeShow: 5,
    URLParams: true,
    showEndPage: true,
    and: [
      "author",
      "license",
      "search",
      "provider",
      "learningResourceType",
      "language",
      "about",
    ],
    sortByDynamic: null,
  },
  searchComponent: {
    component: "search",
    dataField: ["name", "creator.name", "description"],
    fieldWeights: [1, 3],
    queryFormat: "and",
    fuzziness: 0,
    debounce: 100,
    autosuggest: true,
    highlight: true,
    highlightField: "keywords",
    iconPosition: "right",
    showFilter: true,
    URLParams: true,
    and: [
      "author",
      "license",
      "provider",
      "results",
      "learningResourceType",
      "language",
      "about",
    ],
  },
  multiList: [
    {
      component: "author",
      dataField: "creator.name.keyword",
      nestedField: "",
      title: "author",
      placeholder: "author",
      filterLabel: "author",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showSearch: true,
      showFilter: true,
      className: "author-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "license",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "language",
        "about",
      ],
    },
    {
      component: "license",
      dataField: "license",
      title: "license",
      placeholder: "license",
      filterLabel: "license",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "license-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "language",
        "about",
      ],
    },
    {
      component: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "provider",
      placeholder: "provider",
      filterLabel: "provider",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "sourse-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "results",
        "learningResourceType",
        "language",
        "about",
      ],
    },
    {
      component: "language",
      dataField: "inLanguage",
      title: "language",
      placeholder: "language",
      filterLabel: "language",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "language-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "learningResourceType",
        "about",
      ],
    },
    {
      component: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "resourceType",
      placeholder: "resourceType",
      filterLabel: "resourceType",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "about",
      ],
    },
    {
      component: "about",
      dataField: "about.id",
      title: "about",
      placeholder: "about",
      filterLabel: "about",
      queryFormat: "and",
      showMissing: false,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "author",
        "license",
        "search",
        "provider",
        "results",
        "language",
        "learningResourceType",
      ],
    },
  ],
}
