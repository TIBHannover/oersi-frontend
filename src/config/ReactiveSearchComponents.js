import React from "react"
import {
  DataSearch,
  MultiList,
  ReactiveList,
  ResultCard,
} from "@appbaseio/reactivesearch"

export default {
  datasearch: {
    className: "search",
    componentId: "search",
    dataField: ["name", "creator.name", "description", "keywords"],
    fieldWeights: [1, 3],
    queryFormat: "and",
    fuzziness: 0,
    debounce: 100,
    autosuggest: true,
    highlight: true,
    highlightField: "keywords",
    iconPosition: "right",
    URLParams: true,
    react: {
      and: ["about", "results"],
    },
    source: DataSearch,
  },
  resultcard: {
    className: "right-col",
    componentId: "results",
    dataField: "name",
    size: 12,
    render: ({data}) => (
      <ReactiveList.ResultCardsWrapper>
        {data.map((item) => (
          <ResultCard href={item._id} target="_self" key={item._id}>
            <ResultCard.Image src={item.image} />
            <ResultCard.Title>{item.name}</ResultCard.Title>
          </ResultCard>
        ))}
      </ReactiveList.ResultCardsWrapper>
    ),
    pagination: true,
    URLParams: true,
    react: {
      and: ["about", "search"],
    },
    innerClass: {
      resultStats: "result-stats",
      list: "list",
      listItem: "list-item",
      image: "image",
    },
    source: ReactiveList,
  },
  multiList: [
    {
      componentId: "about",
      key: "about",
      dataField: "about.id",
      title: "about",
      placeholder: "about",
      filterLabel: "ABOUT",
      queryFormat: "and",
      showMissing: true,
      missingLabel: "N/A",
      showFilter: true,
      showSearch: false,
      size: 1000,
      className: "about-card",
      fontAwesome: "",
      URLParams: true,
      and: ["search"],
      allowedSearchRegex: /^[\u00C0-\u017Fa-zA-Z .-]*$/, // allow only search-terms matching this regex
      source: MultiList,
    },
  ],
}
