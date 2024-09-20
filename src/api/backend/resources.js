export const getResource = (id) => {
  const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL +
    process.env.NEXT_PUBLIC_BACKEND_API_PATH_SEARCH
  const INDEX_NAME = process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX
  return new Promise((resolve, reject) => {
    fetch(`${BACKEND_API_URL}/${INDEX_NAME}/_source/${id}`, {
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
