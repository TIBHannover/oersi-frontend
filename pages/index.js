/* eslint-disable */
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Search from "../src/views/Search"

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["translation", "language", "audience", "lrt", "subject"])),
			// Will be passed to the page component as props
		},
	};
}

const Oersi = (props) => {

	return (
		<Search />
	)
}

export default Oersi