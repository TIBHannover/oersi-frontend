export const getRequest = (url) => {
  return fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}${url}`, {
    credentials: "same-origin",
  })
}
