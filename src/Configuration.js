import React, {useCallback, useMemo, useState} from "react"
import {BrowserRouter, useLocation, useNavigate} from "react-router"
import prepareSearchConfiguration from "./config/SearchConfiguration"
import {SearchIndexFrontendConfigContext} from "./helpers/use-context"
import {InstantSearch} from "react-instantsearch"
import Client from "@searchkit/instantsearch-client"
import Searchkit from "searchkit"

import {Helmet} from "react-helmet"
import {concatPaths} from "./helpers/helpers"

const useMediaQuery = (query) => {
  const [matches] = useState(window?.matchMedia(query).matches)
  return matches
}

const Configuration = (props) => {
  const {BACKEND_API, ELASTIC_SEARCH_INDEX_NAME, GENERAL_CONFIGURATION, ROUTES} =
    window["runTimeConfig"]

  function returnRender() {
    if (
      BACKEND_API?.BASE_URL &&
      BACKEND_API?.PATH_SEARCH &&
      ELASTIC_SEARCH_INDEX_NAME
    ) {
      return (
        <BrowserRouter basename={GENERAL_CONFIGURATION.PUBLIC_BASE_PATH}>
          <RouterBasedConfig
            BACKEND_RESOURCE_DETAILS_URL={
              BACKEND_API.BASE_URL + BACKEND_API.PATH_RESOURCE_DETAILS_BASE
            }
            BACKEND_SEARCH_API_URL={BACKEND_API.BASE_URL + BACKEND_API.PATH_SEARCH}
            ELASTIC_SEARCH_INDEX_NAME={ELASTIC_SEARCH_INDEX_NAME}
            GENERAL_CONFIGURATION={GENERAL_CONFIGURATION}
            ROUTES={ROUTES}
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
  const {
    BACKEND_RESOURCE_DETAILS_URL,
    BACKEND_SEARCH_API_URL,
    ELASTIC_SEARCH_INDEX_NAME,
    GENERAL_CONFIGURATION,
    ROUTES,
  } = props
  const trackTotalHits = GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    ? GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    : true
  const location = useLocation()
  const navigate = useNavigate()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const changeThemeColorMode = useCallback(
    (mode) => {
      const newMode =
        "dark" === mode || (mode === "auto" && prefersDarkMode) ? "dark" : "light"
      document.documentElement.setAttribute("data-bs-theme", newMode)
    },
    [prefersDarkMode]
  )
  const [colorMode, setColorMode] = useState(initializeColorMode())
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
  function initializeColorMode() {
    let mode
    if (!GENERAL_CONFIGURATION.FEATURES?.DARK_MODE) {
      mode = "light"
    } else {
      const storedColorTheme = localStorage?.getItem("td-color-theme")
      if (storedColorTheme) {
        mode = storedColorTheme
      } else {
        mode = "auto"
      }
    }
    changeThemeColorMode(mode)
    return mode
  }

  const isSearchView = location.pathname === ROUTES.SEARCH
  const [search, setSearch] = useState(location.search)
  const frontendConfig = useMemo(() => {
    function storeColorMode(mode) {
      localStorage?.setItem("td-color-theme", mode)
      setColorMode(mode)
    }
    return {
      ...{
        colorMode: colorMode,
        isDarkMode: isDarkMode,
        onChangeColorMode: (mode) => {
          storeColorMode(mode)
          changeThemeColorMode(mode)
        },
        isFilterViewOpen: isFilterViewOpen,
        onCloseFilterView: () => setFilterViewOpen(false),
        onToggleFilterViewOpen: () => setFilterViewOpen(!isFilterViewOpen),
      },
      ...GENERAL_CONFIGURATION,
      searchConfiguration: prepareSearchConfiguration(GENERAL_CONFIGURATION),
      routes: ROUTES,
      backend: {
        detailsBaseUrl: BACKEND_RESOURCE_DETAILS_URL,
      },
    }
  }, [
    GENERAL_CONFIGURATION,
    ROUTES,
    BACKEND_RESOURCE_DETAILS_URL,
    colorMode,
    changeThemeColorMode,
    isDarkMode,
    isFilterViewOpen,
  ])
  const searchClient = Client(
    new Searchkit({
      connection: {
        host: BACKEND_SEARCH_API_URL,
      },
      search_settings: {
        search_attributes:
          frontendConfig.searchConfiguration.searchField.searchAttributes,
        facet_attributes: frontendConfig.searchConfiguration.facet_attributes,
      },
    }),
    {
      getQuery: (query, search_attributes) => {
        const fields = search_attributes.map((attribute) => {
          const w = attribute.weight ? "^" + attribute.weight : ""
          return typeof attribute === "string" ? attribute : attribute.field + w
        })
        const types = ["cross_fields", "phrase", "phrase_prefix"]
        return {
          bool: {
            must: {
              bool: {
                should: types.map((type) => ({
                  multi_match: {
                    query,
                    fields: fields,
                    type: type,
                    operator: "and",
                  },
                })),
              },
            },
          },
        }
      },
      hooks: {
        beforeSearch: async (searchRequests) => {
          return searchRequests.map((sr) => {
            return {
              ...sr,
              body: {
                ...sr.body,
                track_total_hits: true,
              },
            }
          })
        },
      },
    }
  )

  // TODO implement URL structure

  return (
    <>
      <link
        rel="stylesheet"
        href={concatPaths(
          GENERAL_CONFIGURATION.PUBLIC_BASE_PATH,
          "/css/style-override.css"
        )}
      />
      <SearchIndexFrontendConfigContext.Provider value={frontendConfig}>
        <InstantSearch
          indexName={ELASTIC_SEARCH_INDEX_NAME}
          routing={true} // https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react/#rewriting-urls-manually
          searchClient={searchClient}
        >
          {props.children}
        </InstantSearch>
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
