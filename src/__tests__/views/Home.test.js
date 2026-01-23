import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import {act, render, screen, waitFor} from "@testing-library/react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router"
import Home from "../../views/Home"
import userEvent from "@testing-library/user-event"

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))
jest.mock("react-instantsearch", () => ({
  useSearchBox: () => ({query: "abc", refine: jest.fn()}),
}))

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      translation: {
        HOME: {
          KEYWORDS: ["free to use", "keyword2", "keyword3"],
          SEARCH_PLACEHOLDER_WITH_STATS: "{{ total }}",
        },
      },
    },
    de: {
      translation: {
        HOME: {
          KEYWORDS: ["freie Nutzung", "keyword2", "keyword3"],
          SEARCH_PLACEHOLDER_WITH_STATS: "{{ total }}",
        },
      },
    },
  },
})
const defaultConfig = {
  routes: {
    CONTACT: "/services/contact",
    DETAILS_BASE: "/",
    HOME_PAGE: "/home",
    SEARCH: "/",
  },
  backend: {
    searchApiUrl: "https://example.com/api/search",
    metadataIndexName: "metadata_index",
  },
  PRIVACY_POLICY_LINK: [],
  FEATURES: {HOME_PAGE: true},
  homePage: {
    features: [
      {
        labelKey: "HOME.FEATURE_1",
        links: [{url: {de: "#de", en: "#en"}, labelKey: "LINK_1"}],
      },
      {
        labelKey: "HOME.FEATURE_2",
        links: [{url: {de: "#de", en: "#en"}, labelKey: "LINK_1"}],
      },
    ],
  },
}

describe("Home", () => {
  const renderDefault = (config) => {
    return render(
      <SearchIndexFrontendConfigContext.Provider value={config || defaultConfig}>
        <MemoryRouter initialEntries={["/resources/home"]}>
          <Home />
        </MemoryRouter>
      </SearchIndexFrontendConfigContext.Provider>
    )
  }
  const testWithFakeSidreData = (fakeData, ok = true, statusCode, statusText) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: ok,
        status: statusCode,
        statusText: statusText,
        json: () => Promise.resolve(fakeData),
      })
    )
  }

  it("home render default", () => {
    renderDefault()
    const search = screen.getByRole("textbox", {name: "search"})

    expect(search).toBeInTheDocument()
  })

  it("home features", () => {
    renderDefault()
    const link1 = screen.getByRole("button", {name: "HOME.FEATURE_1.LINK_1"})
    expect(link1).toBeInTheDocument()
    const link2 = screen.getByRole("button", {name: "HOME.FEATURE_2.LINK_1"})
    expect(link2).toBeInTheDocument()
  })

  it("submit search", async () => {
    renderDefault()

    const search = screen.getByRole("textbox", {name: "search"})
    await userEvent.type(search, "searchterm")
    const searchButton = screen.getByRole("button", {name: "Search"})
    await userEvent.click(searchButton)
    expect(mockNavigate).toBeCalled()
  })

  it("home render with activated stats", async () => {
    testWithFakeSidreData({
      hits: {total: {value: 12345}},
      aggregations: {
        provider_count: {value: 57},
      },
    })
    const config = {
      ...defaultConfig,
      homePage: {
        ...defaultConfig.homePage,
        useStats: true,
      },
    }
    renderDefault(config)
    const search = screen.getByRole("textbox", {name: "search"})

    expect(search).toBeInTheDocument()
    await waitFor(() => expect(search.placeholder).toEqual("12345"))
    global.fetch.mockRestore()
  })

  it("home render with statistics counters", async () => {
    testWithFakeSidreData({
      hits: {total: {value: 12345}},
      aggregations: {
        provider_count: {value: 57},
      },
    })
    const config = {
      ...defaultConfig,
      homePage: {
        ...defaultConfig.homePage,
        useStats: true,
        stats: [
          {
            id: "provider_count",
            aggsQuery: {
              provider_count: {
                cardinality: {field: "mainEntityOfPage.provider.name"},
              },
            },
            resultValuePath: "aggregations.provider_count.value",
            labelKey: "HOME.STAT_PROVIDER_COUNT",
            tooltipLabelKey: "HOME.STAT_PROVIDER_COUNT_TOOLTIP",
          },
        ],
      },
    }
    act(() => {
      renderDefault(config)
    })
    const counter = screen.getByTitle("HOME.STAT_PROVIDER_COUNT_TOOLTIP")
    expect(counter).toBeInTheDocument()
    await waitFor(() => expect(counter).toHaveTextContent("57"))
    global.fetch.mockRestore()
  })
})
