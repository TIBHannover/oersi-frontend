import React, {useState, useEffect} from "react"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import "./App.css"
import FooterComponent from "./components/footerComponent/FooterComponent"
import SearchIndexView from "./components/SearchIndexView"
import Cookie from "./components/cookieComponent/Cookie"

const App = (props) => {
  const [multilist] = useState(props.config.get("multiList"))
  // breakpoints - see https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints
  const isMobileOrTablet = useMedia("(max-width: 991.98px)")
  // const isDesktop = useMedia("(min-width: 993px)");
  return (
    <div className="wrapper">
      <ReactiveBase
        className="reactive-base"
        app={props.elasticSearch.APP_NAME}
        url={props.elasticSearch.URL}
        headers={getAuthorizationHeaderIfCredentialsExist(
          props.elasticSearch.CREDENTIALS
        )}
      >
        <SearchIndexView isMobile={isMobileOrTablet} multilist={multilist} />
        <FooterComponent />
        <Cookie />
      </ReactiveBase>
    </div>
  )

  /**
   * function that returns the authorization-header if credentials exist
   * @param {String} credentials
   */
  function getAuthorizationHeaderIfCredentialsExist(credentials) {
    if (credentials !== "" && credentials) return {authorization: credentials}
    else return null
  }

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

export default App
