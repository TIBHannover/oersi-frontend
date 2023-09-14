export const getRequest = (url) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}${url}`, {
    credentials: "same-origin",
  })
}
