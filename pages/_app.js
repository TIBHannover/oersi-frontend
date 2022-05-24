import React from "react"
import {appWithTranslation} from "next-i18next"
import getConfig from "next/config"

import OersiConfigContext from "../src/helpers/OersiConfigContext"

const {publicRuntimeConfig} = getConfig()
function App({Component, pageProps}) {
  return (
    <OersiConfigContext.Provider value={publicRuntimeConfig.GENERAL_CONFIGURATION}>
      <Component {...pageProps} />
    </OersiConfigContext.Provider>
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

export default appWithTranslation(App)
