export default {
  name: "production",
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
    URLParams: true,
    and: [
      "AuthorFilter",
      "LicenseFilter",
      "Search",
      "sourceFilter",
      "learningresourcetypeFilter",
      "inlanguageFilter",
    ],
    sortByDynamic: [
      {
        dataField: "name.keyword",
        sortBy: "asc",
        label: "Sort by Name(A-Z) \u00A0",
      },
      {
        dataField: "name.keyword",
        sortBy: "desc",
        label: "Sort by Name(Z-A)\u00A0 \u00A0",
      },
      {
        dataField: "license.keyword",
        sortBy: "desc",
        label: "Sort by Lizenz(Z-A) \u00A0",
      },
      {
        dataField: "license.keyword",
        sortBy: "asc",
        label: "Sort by Lizenz(A-Z) \u00A0",
      },
      {
        dataField: "inLanguage.keyword",
        sortBy: "desc",
        label: "Sort by Sprache(Z-A) \u00A0",
      },
      {
        dataField: "inLanguage.keyword",
        sortBy: "asc",
        label: "Sort by Sprache(A-Z) \u00A0",
      },
    ],
  },
  searchComponent: {
    component: "Search",
    dataField: ["name", "subject", "description"],
    fieldWeights: [1, 3],
    queryFormat: "or",
    fuzziness: 0,
    debounce: 100,
    autosuggest: true,
    highlight: true,
    highlightField: "keywords",
    iconPosition: "right",
    showFilter: true,
    URLParams: true,
    and: [
      "AuthorFilter",
      "LicenseFilter",
      "Search",
      "sourceFilter",
      "learningresourcetypeFilter",
      "inlanguageFilter",
    ],
  },
  multiList: [
    {
      component: "AuthorFilter",
      dataField: "authors.fullname.keyword",
      nestedField: "authors",
      title: "Autor",
      placeholder: "Autor",
      filterLabel: "Autor",
      showSearch: true,
      showFilter: true,
      className: "author-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter",
      ],
    },
    {
      component: "LicenseFilter",
      dataField: "license.keyword",
      title: "Lizenz",
      placeholder: "Lizenz",
      filterLabel: "Lizenz",
      showFilter: true,
      showSearch: false,
      className: "license-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter",
      ],
    },
    {
      component: "sourceFilter",
      dataField: "source.keyword",
      title: "Quelle",
      placeholder: "Quelle",
      filterLabel: "Quelle",
      showFilter: true,
      showSearch: false,
      className: "sourse-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter",
      ],
    },
    {
      component: "inlanguageFilter",
      dataField: "inLanguage.keyword",
      title: "Sprache",
      placeholder: "Sprache",
      filterLabel: "Sprache",
      showFilter: true,
      showSearch: false,
      className: "language-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter",
      ],
    },
    {
      component: "learningresourcetypeFilter",
      dataField: "learningResourceType.keyword",
      title: "Material",
      placeholder: "Material",
      filterLabel: "Material",
      showFilter: true,
      showSearch: false,
      className: "source-type-card",
      fontAwesome: "",
      URLParams: true,
      and: [
        "AuthorFilter",
        "LicenseFilter",
        "Search",
        "sourceFilter",
        "learningresourcetypeFilter",
        "inlanguageFilter",
      ],
    },
  ],
}
