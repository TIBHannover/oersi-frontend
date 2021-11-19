/* eslint-disable */
import React, { Component } from 'react'
//import getConfig from 'next/config'
import {
	ReactiveBase,
} from '@appbaseio/reactivesearch'
import initReactivesearch from '@appbaseio/reactivesearch/lib/server'
import SearchIndexView from "../components/SearchIndexView"
import ReactiveSearchComponents from "../config/ReactiveSearchComponents"
import Configuration from "../components/Configuration"

// const { publicRuntimeConfig } = getConfig()
const elasticSearchConfig = {
	app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
	url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
}

class Oersi extends Component {

	static async getInitialProps({ pathname, query }) {
		return {
			reactiveSearchStore: await initReactivesearch(
				[
					{
						...ReactiveSearchComponents.datasearch,
					},
					{
						...ReactiveSearchComponents.resultcard,
					},
				],
				query,
				elasticSearchConfig,
			),
		}
	}

	render() {
		return (
			<div className="container">
				<Configuration>
					<ReactiveBase {...elasticSearchConfig} initialState={this.props.reactiveSearchStore}>
						<SearchIndexView components={ReactiveSearchComponents} />
					</ReactiveBase>
				</Configuration>
			</div>
		)
	}
}

export default Oersi