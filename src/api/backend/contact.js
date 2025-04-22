export const submitContactRequest = (contactRequest) => {
  const {BACKEND_API} = window["runTimeConfig"]
    ? window["runTimeConfig"]
    : {
        BACKEND_API: {
          BASE_URL: "",
          PATH_CONTACT: "/api-internal/contact",
        },
      }
  const contactApiUrl = BACKEND_API.BASE_URL + BACKEND_API.PATH_CONTACT

  return new Promise((resolve, reject) => {
    fetch(contactApiUrl, {
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
