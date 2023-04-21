export const submitContactRequest = (contactRequest) => {
  const contactApiUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL +
    process.env.NEXT_PUBLIC_BACKEND_API_PATH_CONTACT

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
