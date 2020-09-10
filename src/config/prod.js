export default {
  name: "production",
  resultList: {
    component: "results",
    dataFiled: "name",
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
      "sourceOrganization",
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
      "sourceOrganization",
    ],
  },
  multiList: [
    {
      component: "author",
      dataField: "creator.name.keyword",
      nestedField: "",
      title: "Autor",
      placeholder: "Autor",
      filterLabel: "Autor",
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
        "sourceOrganization",
      ],
    },
    {
      component: "license",
      dataField: "license",
      title: "Lizenz",
      placeholder: "Lizenz",
      filterLabel: "Lizenz",
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
        "sourceOrganization",
      ],
    },
    {
      component: "provider",
      dataField: "mainEntityOfPage.provider.name",
      title: "Quelle",
      placeholder: "Quelle",
      filterLabel: "Quelle",
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
        "sourceOrganization",
      ],
    },
    {
      component: "language",
      dataField: "inLanguage",
      title: "Sprache",
      placeholder: "Sprache",
      filterLabel: "Sprache",
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
        "sourceOrganization",
      ],
    },
    {
      component: "learningResourceType",
      dataField: "learningResourceType.id",
      title: "Material",
      placeholder: "Material",
      filterLabel: "Material",
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
        "sourceOrganization",
      ],
    },
    {
      component: "sourceOrganization",
      dataField: "sourceOrganization.name",
      title: "organization",
      placeholder: "organization",
      filterLabel: "organization",
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
