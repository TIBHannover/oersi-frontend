import React, {useEffect, useMemo, useState} from "react"
import {BrowserRouter, useLocation, useNavigate} from "react-router"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import prepareSearchConfiguration from "./config/SearchConfiguration"
import {SearchIndexFrontendConfigContext} from "./helpers/use-context"

import {useCookies} from "react-cookie"
import {Helmet} from "react-helmet"

const useMediaQuery = (query) => {
  const [matches] = useState(window?.matchMedia(query).matches)
  return matches
}

const Configuration = (props) => {
  const {BACKEND_API, ELASTIC_SEARCH_INDEX_NAME, GENERAL_CONFIGURATION} =
    window["runTimeConfig"]

  function returnRender() {
    if (
      BACKEND_API?.BASE_URL &&
      BACKEND_API?.PATH_SEARCH &&
      ELASTIC_SEARCH_INDEX_NAME
    ) {
      return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <RouterBasedConfig
            BACKEND_SEARCH_API_URL={BACKEND_API.BASE_URL + BACKEND_API.PATH_SEARCH}
            ELASTIC_SEARCH_INDEX_NAME={ELASTIC_SEARCH_INDEX_NAME}
            GENERAL_CONFIGURATION={GENERAL_CONFIGURATION}
          >
            {props.children}
          </RouterBasedConfig>
        </BrowserRouter>
      )
    } else {
      return <div>App configuration is missing! Please check the config-file.</div>
    }
  }

  return returnRender()
}

// config that needs router hooks
const RouterBasedConfig = (props) => {
  const {BACKEND_SEARCH_API_URL, ELASTIC_SEARCH_INDEX_NAME, GENERAL_CONFIGURATION} =
    props
  const trackTotalHits = GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    ? GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    : true
  const location = useLocation()
  const navigate = useNavigate()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const [cookies, setCookie] = useCookies(["sidreColorMode"])
  const [colorMode, setColorMode] = useState(determineInitialColorMode())
  const isDarkMode =
    "dark" === colorMode || (colorMode === "auto" && prefersDarkMode)
  const [isFilterViewOpen, setFilterViewOpen] = React.useState(
    !useMediaQuery("(max-width: 768px)")
  )

  function shouldResetResultPage(newSearch) {
    const newSearchParams = new URLSearchParams(newSearch || "")
    if (newSearchParams.has("results") && newSearchParams.get("results") > 1) {
      const oldSearchParams = new URLSearchParams(search || "")
      oldSearchParams.delete("results")
      oldSearchParams.delete("size")
      newSearchParams.delete("results")
      newSearchParams.delete("size")
      return oldSearchParams.toString() !== newSearchParams.toString()
    }
    return false
  }
  function determineInitialColorMode() {
    if (!GENERAL_CONFIGURATION.FEATURES?.DARK_MODE) {
      return "light"
    }
    if (cookies.sidreColorMode) {
      return cookies.sidreColorMode
    }
    return prefersDarkMode ? "dark" : "light"
  }
  function storeColorMode(mode) {
    setCookie("sidreColorMode", mode, {
      path: process.env.PUBLIC_URL,
      maxAge: 365 * 24 * 60 * 60,
    })
    setColorMode(mode)
  }
  function changeColorMode(mode) {
    const newMode =
      "dark" === mode || (mode === "auto" && prefersDarkMode) ? "dark" : "light"
    document.documentElement.setAttribute("data-bs-theme", newMode)
  }

  useEffect(() => {
    changeColorMode(determineInitialColorMode())
  }, [])

  const isSearchView = location.pathname === "/"
  const [search, setSearch] = useState(location.search)
  const frontendConfig = useMemo(
    () => ({
      ...{
        colorMode: colorMode,
        isDarkMode: isDarkMode,
        onChangeColorMode: (mode) => {
          storeColorMode(mode)
          changeColorMode(mode)
        },
        isFilterViewOpen: isFilterViewOpen,
        onCloseFilterView: () => setFilterViewOpen(false),
        onToggleFilterViewOpen: () => setFilterViewOpen(!isFilterViewOpen),
      },
      ...GENERAL_CONFIGURATION,
      searchConfiguration: prepareSearchConfiguration(GENERAL_CONFIGURATION),
    }),
    [GENERAL_CONFIGURATION, colorMode, isDarkMode, isFilterViewOpen]
  )

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href={process.env.PUBLIC_URL + "/css/style-override.css"}
        />
      </Helmet>
      <SearchIndexFrontendConfigContext.Provider value={frontendConfig}>
        <ReactiveBase
          className="reactive-base"
          transformRequest={modifyElasticsearchRequest} // workaround: need to modify the request directly, because "TRACK_TOTAL_HITS"-default-query in ReactiveList in gone, if we change the pagesize
          app={ELASTIC_SEARCH_INDEX_NAME}
          url={BACKEND_SEARCH_API_URL}
          key={isDarkMode} // workaround: need to rerender the whole component, otherwise switch light/dark mode does not work for reactivesearch components
          themePreset={isDarkMode ? "dark" : "light"}
          getSearchParams={() => (isSearchView ? location.search : search)} // use params from url only on search-view, otherwise don't show search-state in url
          setSearchParams={(newURL) => {
            let newSearch = new URL(newURL).search
            if (shouldResetResultPage(newSearch)) {
              const params = new URLSearchParams(newSearch)
              params.set("results", "1")
              newSearch = "?" + params.toString()
            }
            setSearch(newSearch)
            navigate({
              pathname: "/",
              search: newSearch,
            })
          }}
        >
          {props.children}
        </ReactiveBase>
      </SearchIndexFrontendConfigContext.Provider>
    </>
  )

  function modifyElasticsearchQuery(query) {
    query["track_total_hits"] = trackTotalHits
    return query
  }
  function modifyElasticsearchRequest(req) {
    if (!req.body?.includes('"track_total_hits"') && trackTotalHits) {
      req.body = req.body
        ?.split("\n")
        .map((l) => {
          if (l.startsWith('{"query"')) {
            const query = modifyElasticsearchQuery(JSON.parse(l))
            return JSON.stringify(query)
          }
          return l
        })
        .join("\n")
    }
    return req
  }
}

export default Configuration
