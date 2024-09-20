export const getResource = (id) => {
  const {BACKEND_API, ELASTIC_SEARCH_INDEX_NAME} = window["runTimeConfig"]
    ? window["runTimeConfig"]
    : {
        BACKEND_API: {
          BASE_URL: "",
          PATH_SEARCH: process.env.PUBLIC_URL + "/api/search",
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
