import {DataSearch, ReactiveList, ResultCard} from "@appbaseio/reactivesearch"

export default {
  datasearch: {
    componentId: 'SearchSensor',
    dataField: 'name',
    autosuggest: false,
    placeholder: 'Search by names',
    iconPosition: 'left',
    className: 'search',
    highlight: false,
    URLParams: true,
    react: {
      and: ["SearchResult"]
    },
    source: DataSearch,
  },
  resultcard: {
    className: "right-col",
    componentId: "SearchResult",
    dataField: "name",
    size: 12,
    render: ({ data }) => (
      <ReactiveList.ResultCardsWrapper>
        {data.map(item => (
          <ResultCard href={item.id} key={item._id}>
            <ResultCard.Image src={item.image} />
            <ResultCard.Title>{item.name}</ResultCard.Title>
          </ResultCard>
        ))}
      </ReactiveList.ResultCardsWrapper>
    ),
    pagination: true,
    URLParams: true,
    react: {
      and: ["SearchSensor"]
    },
    innerClass: {
      resultStats: "result-stats",
      list: "list",
      listItem: "list-item",
      image: "image"
    },
    source: ReactiveList
  }
}