import React from "react"
import "./app-global.css" /* TODO: this global styles do not fit very well into the complete look&feel => replace by a better solution */
import {appWithTranslation} from "next-i18next"
import nextI18nextConfig from "../next-i18next.config"

function App({Component, pageProps}) {
  return <Component {...pageProps} />
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