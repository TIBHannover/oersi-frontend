/* eslint-disable */
import React from 'react'
import initReactivesearch from '@appbaseio/reactivesearch/lib/server'
import ReactiveSearchComponents from "../src/config/ReactiveSearchComponents"
import Configuration from "../src/Configuration"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from "../src/Layout"
import Search from "../src/views/Search"

export async function getServerSideProps(context) {
	const elasticSearchConfig = {
		app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
		url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
	}
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

const Oersi = (props) => {

	return (
		<Configuration initialReactiveSearchState={props.reactiveSearchStore}>
			<Layout>
				<Search />
			</Layout>
		</Configuration>
	)
}

export default Oersi