import React from "react"
import {Route, Switch} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"

import "./App.css"
import {OersiConfigContext} from "./helpers/use-context"
import CookieNotice from "./components/CookieNotice"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ScrollTop from "./components/ScrollTop"
import Contact from "./views/Contact"
import ResourceDetails from "./views/ResourceDetails"
import Search from "./views/Search"

const App = (props) => {
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)

  return (
    <>
      <Helmet>
        <title>{t("META.TITLE")}</title>
        <meta name="description" content={t("META.DESCRIPTION")} />
        <link rel="canonical" href={oersiConfig.PUBLIC_URL} />
      </Helmet>
      <Header />
      {oersiConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <Switch>
        <Route exact path="/">
          <Search />
        </Route>
        <Route exact path="/services/contact" component={Contact} />
        <Route
          exact
          path="(/details)?/:resourceId([A-Za-z0-9-_=]{12,})"
          component={ResourceDetails}
        />
      </Switch>
      <Footer />
      <CookieNotice />
    </>
  )
}

export default App
