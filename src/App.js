import Header from "./components/Header"
import SearchIndexView from "./components/SearchIndexView"
import ReactiveSearchComponents from "./config/ReactiveSearchComponents"
import React from "react"

const App = (props) => {
  return (
    <>
      <Header />
      <SearchIndexView components={ReactiveSearchComponents} />
    </>
  )
}

export default App
