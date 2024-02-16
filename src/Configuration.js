import React, {useEffect, useMemo, useState} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {cyan, green, grey} from "@mui/material/colors"
import {alpha, useMediaQuery} from "@mui/material"

import prepareSearchConfiguration from "../src/config/SearchConfiguration"
import OersiConfigContext from "../src/helpers/OersiConfigContext"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import {useCookies} from "react-cookie"
import {useRouter} from "next/router"
import Head from "next/head"

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
    EMBED_OER: process.env.NEXT_PUBLIC_FEATURE_EMBED_OER === "true",
    OERSI_THUMBNAILS: process.env.NEXT_PUBLIC_FEATURE_OERSI_THUMBNAILS === "true",
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
      custom: {
        background: isDarkMode ? "#414243" : "#c1c2c3",
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
  const [cookies, setCookie] = useCookies(["oersiColorMode"])
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
    if (cookies?.oersiColorMode) {
      return cookies.oersiColorMode
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
  const oersiConfig = useMemo(
    () => ({
      ...{
        filterSidebarWidth: 300,
        onChangeFontSize: (size) => setCustomFontSize(size),
        onToggleColorMode: () => {
          const newMode = colorMode === "dark" ? "light" : "dark"
          setColorMode(newMode)
          setCookie("oersiColorMode", newMode, {
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
      searchConfiguration: prepareSearchConfiguration(GENERAL_CONFIGURATION.search),
    }),
    [colorMode, setCookie, isDesktopFilterViewOpen, isMobileFilterViewOpen]
  )
  return (
    <div style={{visibility: mounted ? "visible" : "hidden"}}>
      <Head>
        <style className="custom-style">
          {`
:root {
  --mui-palette-custom-background: ${theme.palette.custom.background};
  --mui-palette-primary-main: ${theme.palette.primary.main};
  --mui-palette-text-secondary: ${theme.palette.text.secondary};
  --mui-palette-background-paper: ${theme.palette.background.paper};
  --mui-palette-divider: ${theme.palette.divider};
}
            `}
        </style>
      </Head>
      <ThemeProvider theme={theme}>
        <OersiConfigContext.Provider value={oersiConfig}>
          <ReactiveBase
            transformRequest={modifyElasticsearchRequest} // workaround: need to modify the request directly, because "TRACK_TOTAL_HITS"-default-query in ReactiveList in gone, if we change the pagesize
            {...elasticSearchConfig}
            key={isDarkMode} // workaround: need to rerender the whole component, otherwise switch light/dark mode does not work for reactivesearch components
            themePreset={isDarkMode ? "dark" : "light"}
            getSearchParams={() => search} // use params from url only on search-view, otherwise don't show search-state in url
            setSearchParams={(newURL) => {
              let newSearch = new URL(newURL).search
              setSearch(newSearch)
              router.push({
                pathname: "/",
                search: newSearch,
              })
            }}
          >
            {props.children}
          </ReactiveBase>
        </OersiConfigContext.Provider>
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
