import React from "react"
import Contact from "../../src/views/Contact"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"

export async function getStaticProps({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["translation"])),
      // Will be passed to the page component as props
    },
  }
}

const ContactPage = (props) => {
  return <Contact />
}

export default ContactPage
