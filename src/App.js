import React, { useState, useEffect } from "react"
import { ReactiveBase } from "@appbaseio/reactivesearch"
import "./App.css"
import FooterComponent from "./components/footerComponent/FooterComponent"
import FilterComponent from "./components/filterComponent/FilterComponent"

const App = (props) => {
  const [multilist] = useState(props.config.get("multiList"))
  const isMobileOrTablet = useMedia("(max-width: 990px)");
  // const isDesktop = useMedia("(min-width: 993px)");

  return (
    <div className="wrapper">
      <ReactiveBase
        className="reactive-base"
        app={props.data.APP_NAME}
        url={props.data.URL}
        headers={checkIfExeistCredencial(props.data.CREDENCIAL)}
      >
        <FilterComponent isMobile={isMobileOrTablet} multilist={multilist} />
        <FooterComponent />
      </ReactiveBase>
    </div>
  )

  /**
   * function to check if exist credencal for Reactive search or not
   * @param {String} credencial
   */
  function checkIfExeistCredencial(credencial) {
    if (credencial !== "" && credencial) return { authorization: credencial }
    else return null
  }

  function useMedia(query) {
    const [matches, setMatches] = useState(
      window.matchMedia(query).matches
    );

    // Activity normally for componentDidMount + componentDidUpdate
    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      const listener = () => setMatches(media.matches);
      media.addListener(listener);

      return () => media.removeListener(listener);
    }, [query]);

    // publish value for render
    return matches;
  }
}

  export default App
