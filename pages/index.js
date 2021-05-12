/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
  ReactiveList,
	ResultCard,
} from '@appbaseio/reactivesearch';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

const components = {
	settings: {
    app: "oer_data",
    url: "http://192.168.98.115/resources/api-internal/search",
  },
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
    }
  }
};

export default class Main extends Component {
	static async getInitialProps({ pathname, query }) {
		
		return {
			store: await initReactivesearch(
				[
					{
						...components.datasearch,
						source: DataSearch
					},
					{
						...components.resultcard,
						source: ReactiveList
					},
				],
				query,
				components.settings,
			),
		};
	}

	render() {
		return (
			<div className="container">
				<ReactiveBase {...components.settings} initialState={this.props.store}>
					<nav className="nav">
						<div className="title">OERSI</div>
						<DataSearch {...components.datasearch} />
					</nav>
					<ReactiveList {...components.resultcard} />
				</ReactiveBase>
			</div>
		);
	}
}
