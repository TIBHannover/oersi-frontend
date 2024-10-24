import React, {useEffect, useMemo, useState} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {cyan, green, grey} from "@mui/material/colors"
import {alpha, CssBaseline, useMediaQuery} from "@mui/material"

import prepareSearchConfiguration from "../src/config/SearchConfiguration"
import SearchIndexFrontendConfigContext from "./helpers/SearchIndexFrontendConfigContext"
import {useCookies} from "react-cookie"
import {useRouter} from "next/router"
import Head from "next/head"
import {InstantSearch} from "react-instantsearch"
import Client from "@searchkit/instantsearch-client"
import Searchkit from "searchkit"

const DEFAULT_THEME_COLORS = {
  primary: {
    main: cyan[300],
  },
  secondary: {
    main: green[300],
  },
}
const GENERAL_CONFIGURATION = {
  AVAILABLE_LANGUAGES: process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(","),
  PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL,
  RESULT_PAGE_SIZE_OPTIONS:
    process.env.NEXT_PUBLIC_RESULT_PAGE_SIZE_OPTIONS.split(","),
  NR_OF_RESULT_PER_PAGE: parseInt(process.env.NEXT_PUBLIC_NR_OF_RESULT_PER_PAGE),
  HEADER_LOGO_URL: process.env.NEXT_PUBLIC_HEADER_LOGO_URL,
  THEME_COLORS: process.env.NEXT_PUBLIC_THEME_COLORS
    ? JSON.parse(process.env.NEXT_PUBLIC_THEME_COLORS)
    : DEFAULT_THEME_COLORS,
  THEME_COLORS_DARK: process.env.NEXT_PUBLIC_THEME_COLORS_DARK
    ? JSON.parse(process.env.NEXT_PUBLIC_THEME_COLORS_DARK)
    : DEFAULT_THEME_COLORS,
  PRIVACY_POLICY_LINK: process.env.NEXT_PUBLIC_PRIVACY_POLICY_LINK
    ? JSON.parse(process.env.NEXT_PUBLIC_PRIVACY_POLICY_LINK)
    : null,
  EXTERNAL_INFO_LINK: process.env.NEXT_PUBLIC_EXTERNAL_INFO_LINK
    ? JSON.parse(process.env.NEXT_PUBLIC_EXTERNAL_INFO_LINK)
    : {},
  TRACK_TOTAL_HITS:
    process.env.NEXT_PUBLIC_TRACK_TOTAL_HITS?.toLowerCase() !== "false",
  FEATURES: {
    CHANGE_FONTSIZE: process.env.NEXT_PUBLIC_FEATURE_CHANGE_FONTSIZE === "true",
    DARK_MODE: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === "true",
    RESOURCE_EMBEDDING_SNIPPET:
      process.env.NEXT_PUBLIC_FEATURE_RESOURCE_EMBEDDING_SNIPPET === "true",
    SIDRE_THUMBNAILS: process.env.NEXT_PUBLIC_FEATURE_SIDRE_THUMBNAILS === "true",
    SCROLL_TOP_BUTTON: process.env.NEXT_PUBLIC_FEATURE_SCROLL_TOP_BUTTON === "true",
  },
  fieldConfiguration: JSON.parse(process.env.NEXT_PUBLIC_FIELD_CONFIGURATION),
  embeddedStructuredDataAdjustments: JSON.parse(
    process.env.NEXT_PUBLIC_EMBEDDED_STRUCTURED_DATA_ADJUSTMENTS
  ),
  search: JSON.parse(process.env.NEXT_PUBLIC_SEARCH_CONFIGURATION),
  resultCard: JSON.parse(process.env.NEXT_PUBLIC_RESULT_CARD_CONFIGURATION),
  detailPage: JSON.parse(process.env.NEXT_PUBLIC_DETAIL_PAGE_CONFIGURATION),
}
function getTheme(isDarkMode = false, fontSize = null) {
  const colors = isDarkMode
    ? GENERAL_CONFIGURATION.THEME_COLORS_DARK
    : GENERAL_CONFIGURATION.THEME_COLORS
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: colors.primary,
      secondary: colors.secondary,
      grey: {
        main: grey[300],
      },
      background: {
        default: isDarkMode ? "#414243" : "#c1c2c3",
      },
    },
    breakpoints: {
      // migration to v5: we use our previous breakpoints for now, but should migrate this to the new standard
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      // workaround: inherit font-family from css, because otherwise a default font is used (for link-buttons for example)
      fontFamily: "inherit",
      ...(fontSize && {
        fontSize: fontSize,
      }),
    },
  })
  return createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: `
.sidre-background-color-paper {
  background-color: ${theme.palette.background.paper};
}
.sidre-divider-color {
  border-color: ${theme.palette.divider};
}
a {
  color: ${theme.palette.primary.main};
}
.sidre-textcolor-secondary {
  color: ${theme.palette.text.secondary};
}
.full-width {
  width: 100%;
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: stretch;
}

/* styling for scrollbar */

::-webkit-scrollbar {
  width: 13px;
  height: 5px;
}

::-webkit-scrollbar:hover {
  height: 50px;
}

::-webkit-scrollbar-track-piece {
  background-color: #fafafa;
}

::-webkit-scrollbar-thumb:vertical {
  height: 50px;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, #ccc),
    color-stop(100%, #ccc)
  );
  border: 1px solid #0d0d0d;
  border-top: 1px solid #666;
  border-left: 1px solid #666;
  border-radius: 50px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 50px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0, #ccc),
    color-stop(100%, #ccc)
  );
  border: 1px solid #1f1f1f;
  border-top: 1px solid #666;
  border-left: 1px solid #666;
  border-radius: 50px;
}
      `,
      },
      MuiButton: {
        variants: [
          {
            props: {variant: "contained", color: "grey"},
            style: {
              color: theme.palette.getContrastText(theme.palette.grey[300]),
              "&:hover": {
                backgroundColor: "#d5d5d5",
              },
            },
          },
          {
            props: {variant: "text", color: "grey"},
            style: {
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.text.primary,
                  theme.palette.action.hoverOpacity
                ),
              },
            },
          },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            "&:focus": {
              textDecoration: "underline",
              outline: "1px dotted rgba(0, 0, 0, 0.87)",
            },
          },
        },
      },
    },
  })
}

const Configuration = (props) => {
  const elasticSearchConfig = {
    app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
    url:
      process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL +
      process.env.NEXT_PUBLIC_BACKEND_API_PATH_SEARCH,
  }

  const trackTotalHits = GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    ? GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    : true
  const router = useRouter()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  })
  const [cookies, setCookie] = useCookies(["sidreColorMode"])
  const [colorMode, setColorMode] = useState("light")
  const isDarkMode = "dark" === colorMode
  const [customFontSize, setCustomFontSize] = useState(12)
  const [isDesktopFilterViewOpen, setDesktopFilterViewOpen] = React.useState(true)
  const [isMobileFilterViewOpen, setMobileFilterViewOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const theme = useMemo(
    () => getTheme(colorMode === "dark", customFontSize),
    [colorMode, customFontSize]
  )
  function determineInitialColorMode() {
    if (!GENERAL_CONFIGURATION.FEATURES?.DARK_MODE) {
      return "light"
    }
    if (cookies?.sidreColorMode) {
      return cookies.sidreColorMode
    }
    return prefersDarkMode ? "dark" : "light"
  }

  useEffect(() => {
    setColorMode(determineInitialColorMode())
    setMounted(true)
  }, [])

  const [search, setSearch] = useState(
    new URLSearchParams(router.query).toString()
      ? "?" + new URLSearchParams(router.query).toString()
      : ""
  )
  const frontendConfig = useMemo(
    () => ({
      ...{
        filterSidebarWidth: 300,
        onChangeFontSize: (size) => setCustomFontSize(size),
        onToggleColorMode: () => {
          const newMode = colorMode === "dark" ? "light" : "dark"
          setColorMode(newMode)
          setCookie("sidreColorMode", newMode, {
            path: router.basePath,
            maxAge: 365 * 24 * 60 * 60,
          })
        },
        isDesktopFilterViewOpen: isDesktopFilterViewOpen,
        onCloseDesktopFilterView: () => setDesktopFilterViewOpen(false),
        onToggleDesktopFilterViewOpen: () =>
          setDesktopFilterViewOpen(!isDesktopFilterViewOpen),
        isMobileFilterViewOpen: isMobileFilterViewOpen,
        onCloseMobileFilterView: () => setMobileFilterViewOpen(false),
        onToggleMobileFilterViewOpen: () =>
          setMobileFilterViewOpen(!isMobileFilterViewOpen),
      },
      ...GENERAL_CONFIGURATION,
      searchConfiguration: prepareSearchConfiguration(GENERAL_CONFIGURATION),
    }),
    [colorMode, setCookie, isDesktopFilterViewOpen, isMobileFilterViewOpen]
  )
  const searchClient = Client(
    new Searchkit({
      connection: {
        host: elasticSearchConfig.url,
      },
      search_settings: {
        search_attributes:
          frontendConfig.searchConfiguration.searchField.searchAttributes,
        facet_attributes: frontendConfig.searchConfiguration.facet_attributes,
      },
    }),
    {
      getQuery: (query, search_attributes) => {
        const fields = search_attributes.map((attribute) => {
          const w = attribute.weight ? "^" + attribute.weight : ""
          return typeof attribute === "string" ? attribute : attribute.field + w
        })
        const types = ["cross_fields", "phrase", "phrase_prefix"]
        return {
          bool: {
            must: {
              bool: {
                should: types.map((type) => ({
                  multi_match: {
                    query,
                    fields: fields,
                    type: type,
                    operator: "and",
                  },
                })),
              },
            },
          },
        }
      },
      hooks: {
        beforeSearch: async (searchRequests) => {
          return searchRequests.map((sr) => {
            return {
              ...sr,
              body: {
                ...sr.body,
                track_total_hits: true,
              },
            }
          })
        },
      },
    }
  )
  return (
    <div style={{visibility: mounted ? "visible" : "hidden"}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SearchIndexFrontendConfigContext.Provider value={frontendConfig}>
          <InstantSearch
            indexName={elasticSearchConfig.app}
            routing={true} // https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react/#rewriting-urls-manually
            searchClient={searchClient}
          >
            {props.children}
          </InstantSearch>
        </SearchIndexFrontendConfigContext.Provider>
      </ThemeProvider>
    </div>
  )

  function modifyElasticsearchQuery(query) {
    query["track_total_hits"] = trackTotalHits
    return query
  }
  function modifyElasticsearchRequest(req) {
    if (!req.body?.includes('"track_total_hits"') && trackTotalHits) {
      req.body = req.body
        ?.split("\n")
        .map((l) => {
          if (l.startsWith('{"query"')) {
            const query = modifyElasticsearchQuery(JSON.parse(l))
            return JSON.stringify(query)
          }
          return l
        })
        .join("\n")
    }
    return req
  }
}

export default Configuration
