export default function getParams(location) {
  const searchParams = new URLSearchParams(location.search)
  return searchParams
}
