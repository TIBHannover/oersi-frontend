import React from "react"
import {appWithTranslation} from "next-i18next"
import nextI18nextConfig from "../next-i18next.config"
import Configuration from "../src/Configuration"
import Layout from "../src/Layout"

function App({Component, pageProps}) {
  return (
    <Configuration>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Configuration>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default appWithTranslation(App, nextI18nextConfig)