/* eslint-disable */
import React from 'react'
import initReactivesearch from '@appbaseio/reactivesearch/lib/server'
import ReactiveSearchComponents from "../src/config/ReactiveSearchComponents"
import Configuration, {getCustomStyles} from "../src/Configuration"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from "../src/Layout"
import Search from "../src/views/Search"
import {getFooterHtml} from "../src/components/Footer"

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
			...ReactiveSearchComponents.multiList,
		],
		context.query,
		elasticSearchConfig,
	)
	const translations = await serverSideTranslations(context.locale, ["translation", "language", "audience", "lrt", "subject"])
	if (!rs_data) {
		return {
			notFound: true,
		}
	}
	const rs_data_prep = JSON.parse(JSON.stringify(rs_data))	// workaround to make the data serializable
	const footer = await getFooterHtml(context.locale)
	const customStyles = await getCustomStyles()
	return {
		props: {
			...translations,
			reactiveSearchStore: rs_data_prep,
			footer: !footer.error ? footer.html : null,
			customStyles: customStyles,
		}
	}
}

const Oersi = (props) => {

	return (
		<Configuration
			initialReactiveSearchState={props.reactiveSearchStore}
			customStyles={props.customStyles}
		>
			<Layout footerHtml={props.footer}>
				<Search />
			</Layout>
		</Configuration>
	)
}

export default Oersi