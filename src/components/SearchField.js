import React, {useState} from "react"
import {DataSearch} from "@appbaseio/reactivesearch"
import {useTranslation} from "next-i18next"
import {Box, useTheme} from "@mui/material"
import ReactiveSearchComponents from "../config/ReactiveSearchComponents"

const SearchField = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const conf = ReactiveSearchComponents.datasearch

  return (
    <Box
      className={
        "search-component" +
        (theme.palette.mode === "dark" ? " search-component-dark" : "")
      }
      sx={{
        fontSize: theme.typography.fontSize * 0.9,
        "& .search-component-input": {
          fontSize: theme.typography.fontSize * 0.9,
          borderRadius: "1em",
        },
        "& .search-component-input:focus": {
          boxShadow: "0 0 0 0.2rem rgba(232, 97, 97, 0.25)",
        },
        "& li": {
          fontSize: theme.typography.fontSize * 0.9,
          ...(theme.palette.mode === "dark" && {
            backgroundColor: "rgb(66,66,66) !important",
          }),
        },
        "& svg.search-icon": {
          fill: "#e86161 !important",
          height: "1.2em",
        },
        ...(theme.palette.mode === "dark" && {
          "& ul": {
            scrollbarColor: "grey rgb(66,66,66) !important",
          },
        }),
      }}
    >
      <DataSearch
        {...conf}
        placeholder={t("SEARCH_COMPONENT.PLACEHOLDER")}
        innerClass={{
          input: "search-component-input",
        }}
      />
      {/*<DataSearch*/}
      {/*  componentId={conf.component}*/}
      {/*  placeholder={t && t("SEARCH_COMPONENT.PLACEHOLDER")}*/}
      {/*  dataField={conf.dataField}*/}
      {/*  fieldWeights={conf.fieldWeights}*/}
      {/*  // queryFormat={conf.queryFormat}*/}
      {/*  // fuzziness={conf.fuzziness}*/}
      {/*  // debounce={conf.debounce}*/}
      {/*  autosuggest={conf.autosuggest}*/}
      {/*  highlight={conf.highlight}*/}
      {/*  highlightField={conf.highlightField}*/}
      {/*  customHighlight={() => ({*/}
      {/*    highlight: {*/}
      {/*      pre_tags: ["<mark>"],*/}
      {/*      post_tags: ["</mark>"],*/}
      {/*      fields: {*/}
      {/*        text: {},*/}
      {/*        title: {},*/}
      {/*      },*/}
      {/*      number_of_fragments: 0,*/}
      {/*    },*/}
      {/*  })}*/}
      {/*  innerClass={{*/}
      {/*    title: "search-title",*/}
      {/*    input: "search-component-input",*/}
      {/*    mic: "search-component-img",*/}
      {/*  }}*/}
      {/*  searchInputId="NameSearch"*/}
      {/*  iconPosition={conf.iconPosition}*/}
      {/*  showFilter={conf.showFilter}*/}
      {/*  URLParams={conf.URLParams}*/}
      {/*  react={{*/}
      {/*    and: conf.and,*/}
      {/*  }}*/}
      {/*  renderNoSuggestion={() => onNoSuggestion()}*/}
      {/*  renderError={(error) => onError(error)}*/}
      {/*/>*/}
    </Box>
  )
  function onError(error) {
    return (
      <div>
        Something went wrong!
        <br />
        Error details
        <br />
        {error}
      </div>
    )
  }

  function onNoSuggestion() {
    return <div>No suggestions found</div>
  }
}

export default SearchField
