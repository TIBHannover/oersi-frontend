export const getConfiguration = (url) => {
  return fetch(`${process.env.PUBLIC_URL}${url}`)
}
