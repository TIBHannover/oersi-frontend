import React, {useMemo} from "react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"

export const getResource = (id) => {
  const {BACKEND_API, ELASTIC_SEARCH_INDEX_NAME} = window["runTimeConfig"]
    ? window["runTimeConfig"]
    : {
        BACKEND_API: {
          BASE_URL: "",
          PATH_SEARCH: "/api/search",
        },
        ELASTIC_SEARCH_INDEX_NAME: "oer_data",
      }
  const searchApiUrl = BACKEND_API.BASE_URL + BACKEND_API.PATH_SEARCH
  const indexName = ELASTIC_SEARCH_INDEX_NAME

  return new Promise((resolve, reject) => {
    fetch(`${searchApiUrl}/${indexName}/_source/${id}`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({
            error: new Error(
              `Error response. (${response.status}) ${response.statusText}`
            ),
            statusCode: response.status,
            statusText: response.statusText,
          })
        } else {
          const json = response.json()
          if (json.then) {
            json.then(resolve).catch(reject)
          } else {
            return resolve(json)
          }
        }
      })
      .catch(reject)
  })
}

export const useCustomStats = (valueConfiguration) => {
  const [stats, setStats] = React.useState(null)
  const {backend} = React.useContext(SearchIndexFrontendConfigContext)
  const searchApiUrl = backend.searchApiUrl
  const indexName = backend.metadataIndexName

  const query = useMemo(() => {
    const aggs = valueConfiguration
      ?.map((config) => config.aggsQuery)
      ?.reduce((acc, cur) => {
        return {...acc, ...cur}
      })

    const q = {size: 0, track_total_hits: true}
    if (aggs) {
      q.aggs = aggs
    }
    return q
  }, [valueConfiguration])

  React.useEffect(() => {
    fetch(`${searchApiUrl}/${indexName}/_search`, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        ContentType: "application/json",
      }),
      body: JSON.stringify(query),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(
          `Error response. (${response.status}) ${response.statusText}`
        )
      })
      .then((data) => {
        const statsResult = {total: data.hits.total.value}
        valueConfiguration?.forEach((config) => {
          statsResult[config.id] = getResultValueByPath(data, config.resultValuePath)
        })
        setStats(statsResult)
      })
      .catch((error) => {
        console.error("Error fetching stats:", error)
      })
  }, [indexName, searchApiUrl, query, valueConfiguration])
  return stats
}
function getResultValueByPath(data, path) {
  return path
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== null ? obj[key] : null), data)
}
