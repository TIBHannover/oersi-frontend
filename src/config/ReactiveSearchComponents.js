import React from "react"
import {DataSearch, ReactiveList, ResultCard} from "@appbaseio/reactivesearch"

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
      and: ["results"],
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
      and: ["search"],
    },
    innerClass: {
      resultStats: "result-stats",
      list: "list",
      listItem: "list-item",
      image: "image",
    },
    source: ReactiveList,
  },
}
