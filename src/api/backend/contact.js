export const submitContactRequest = (contactRequest) => {
  const {BACKEND_API_URL} = window["runTimeConfig"]
    ? window["runTimeConfig"]
    : {
        BACKEND_API_URL: process.env.PUBLIC_URL + "/api-internal",
      }

  return new Promise((resolve, reject) => {
    fetch(BACKEND_API_URL + "/contact", {
      method: "POST",
      body: contactRequest,
      headers: {
        "Content-Type": "application/json",
      },
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
          return resolve()
        }
      })
      .catch(reject)
  })
}
