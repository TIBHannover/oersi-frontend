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
import HeaderComponent from "../components/HeaderComponent"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {Test} from "../components/Test";

// const { publicRuntimeConfig } = getConfig()
const elasticSearchConfig = {
	app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
	url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
}

export async function getServerSideProps(context) {
	const rs_data = await initReactivesearch(
		[
			{
				...ReactiveSearchComponents.datasearch,
			},
			{
				...ReactiveSearchComponents.resultcard,
			},
		],
		context.query,
		elasticSearchConfig,
	)
	const translations = await serverSideTranslations(context.locale, ['translation', 'language'])
	if (!rs_data) {
		return {
			notFound: true,
		}
	}
	const rs_data_prep = JSON.parse(JSON.stringify(rs_data))	// workaround to make the data serializable
	return {
		props: {
			...translations,
			reactiveSearchStore: rs_data_prep,
		}
	}
}

class Oersi extends Component {

	render() {
		return (
			<div className="container">
				<Configuration>
					<ReactiveBase {...elasticSearchConfig} initialState={this.props.reactiveSearchStore}>
						{/*<Test />*/}
						<HeaderComponent />
						<SearchIndexView components={ReactiveSearchComponents} />
					</ReactiveBase>
				</Configuration>
			</div>
		)
	}
}

export default Oersi