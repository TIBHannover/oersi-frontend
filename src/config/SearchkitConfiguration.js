import {history} from "instantsearch.js/es/lib/routers"
import Client from "@searchkit/instantsearch-client"
import Searchkit from "searchkit"

export function getSearchkitRouting(
  searchIndexName,
  searchConfiguration,
  defaultPageSize
) {
  return {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[searchIndexName]
        let routeState = {
          search: indexUiState.query,
        }
        routeState = searchConfiguration.filters.reduce((acc, filter) => {
          if (filter.type === "switch") {
            acc[filter.componentId] = indexUiState.toggle?.[filter.componentId]
          } else {
            acc[filter.componentId] =
              indexUiState.refinementList?.[filter.componentId]
          }
          return acc
        }, routeState)
        if (
          indexUiState.hitsPerPage &&
          indexUiState.hitsPerPage !== defaultPageSize
        ) {
          routeState.size = indexUiState.hitsPerPage
        }
        if (indexUiState.page) {
          routeState.page = indexUiState.page
        }
        return routeState
      },
      routeToState(routeState) {
        const refinementList = searchConfiguration.filters
          .filter((filter) => filter.type !== "switch")
          .reduce((acc, filter) => {
            acc[filter.componentId] = routeState[filter.componentId]
            return acc
          }, {})
        const toggle = searchConfiguration.filters
          .filter((filter) => filter.type === "switch")
          .reduce((acc, filter) => {
            acc[filter.componentId] = routeState[filter.componentId]
            return acc
          }, {})
        return {
          [searchIndexName]: {
            query: routeState.search,
            refinementList: refinementList,
            toggle: toggle,
            hitsPerPage: routeState.size,
            page: routeState.page,
          },
        }
      },
    },
    router: history({
      cleanUrlOnDispose: false,
      createURL({qsModule, routeState, location}) {
        const searchParams = new URLSearchParams(location.search)
        Object.keys(routeState).forEach((key) => {
          searchParams.delete(key)
          if (routeState[key] !== undefined) {
            searchParams.set(key, encode(routeState[key]))
          }
        })
        if (!routeState.size) {
          searchParams.delete("size")
        }
        if (!routeState.page) {
          searchParams.delete("page")
        }
        const newSearch = searchParams.toString()
        return (
          location.origin +
          location.pathname +
          (newSearch ? "?" + newSearch : newSearch)
        )
      },
      parseURL({qsModule, location}) {
        const routeState = {}
        const searchParams = new URLSearchParams(location.search)
        searchParams.keys().forEach((key) => {
          const value = searchParams.get(key)
          try {
            routeState[key] = decode(value)
          } catch (e) {
            // Do not set value if JSON parsing fails.
            console.warn(`Failed to decode value for key "${key}":`, e)
          }
        })
        return routeState
      },
    }),
  }
}
function encode(value) {
  return JSON.stringify(value)
}
function decode(value) {
  return JSON.parse(value)
}

export function getSearchkitClient(backendSearchApiUrl, searchConfiguration) {
  return Client(
    new Searchkit(
      {
        connection: {
          host: backendSearchApiUrl,
        },
        search_settings: {
          search_attributes: searchConfiguration.searchField.searchAttributes,
          facet_attributes: searchConfiguration.facet_attributes,
        },
      },
      {debug: true}
    ),
    {
      getBaseFilters: () => {
        return searchConfiguration.globalDataRestrictions
      },
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
}
