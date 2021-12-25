import React, {useEffect, useState} from "react"
import {Route, Switch} from "react-router-dom"
import {withTranslation} from "react-i18next"
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
  const oersiConfig = React.useContext(OersiConfigContext)
  // breakpoints - see https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints
  const isMobileOrTablet = useMedia("(max-width: 991.98px)")

  return (
    <>
      <Helmet>
        <title>{props.t("META.TITLE")}</title>
        <meta name="description" content={props.t("META.DESCRIPTION")} />
        <link rel="canonical" href={oersiConfig.PUBLIC_URL} />
      </Helmet>
      <Header />
      {oersiConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <Switch>
        <Route exact path="/">
          <Search isMobile={isMobileOrTablet} />
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

  function useMedia(query) {
    const [matches, setMatches] = useState(false)

    // Activity normally for componentDidMount + componentDidUpdate
    useEffect(() => {
      const media = window.matchMedia(query)
      if (media.matches !== matches) {
        setMatches(media.matches)
      }

      const listener = () => setMatches(media.matches)
      media.addListener(listener)

      return () => media.removeListener(listener)
    }, [query, matches])

    // publish value for render
    return matches
  }
}

export default withTranslation()(App)
