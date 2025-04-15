import React, {useEffect} from "react"
import {Route, Routes, useLocation, useNavigate} from "react-router"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {forceCheck} from "react-lazyload"

import {SearchIndexFrontendConfigContext} from "./helpers/use-context"
import CookieNotice from "./components/CookieNotice"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ScrollTop from "./components/ScrollTop"
import Contact from "./views/Contact"
import ResourceDetails from "./views/ResourceDetails"
import Search from "./views/Search"
import Container from "react-bootstrap/Container"
import Home from "./views/Home"
import Button from "react-bootstrap/Button"
import {ArrowLeftShortIcon} from "./components/CustomIcons"

const BackButton = (props) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  return (
    <Button
      variant="tertiary"
      size="sm"
      aria-label="back to previous page"
      onClick={() => navigate(-1)}
    >
      <ArrowLeftShortIcon className={"fs-4"} />
      <span className="align-middle">{t("LABEL.BACK")}</span>
    </Button>
  )
}

const App = (props) => {
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const location = useLocation()
  const isSearchView = location.pathname === "/"
  useEffect(() => {
    if (isSearchView) {
      forceCheck() // force check for lazyload; otherwise it may not load components/images if switching routes
    }
  }, [isSearchView])

  return (
    <>
      <Helmet>
        <title>{t("META.TITLE")}</title>
        <meta name="description" content={t("META.DESCRIPTION")} />
        <link rel="canonical" href={frontendConfig.PUBLIC_URL} />
        <meta property="og:title" content={t("META.TITLE")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={frontendConfig.PUBLIC_URL} />
        <meta property="og:site_name" content={t("HEADER.TITLE")} />
        <meta property="og:description" content={t("META.DESCRIPTION")} />
        {frontendConfig.DEFAULT_SOCIAL_MEDIA_IMAGE && (
          <meta
            property="og:image"
            content={frontendConfig.DEFAULT_SOCIAL_MEDIA_IMAGE}
          />
        )}
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      {frontendConfig.FEATURES.SCROLL_TOP_BUTTON && <ScrollTop />}
      <Container fluid={true} className="content px-0">
        <Routes>
          <Route path="/" element={null} />
          <Route path="/home" element={null} />
          <Route
            path="/*"
            element={
              <Container className="mt-3">
                <BackButton />
              </Container>
            }
          />
        </Routes>
        {/* use hidden filters instead of separate Router-Route, because otherwise the search-field crashes on non-search-views */}
        <div className={isSearchView ? "" : "d-none "}>
          <Search />
        </div>
        <Routes>
          <Route path="/" element={null} />
          {frontendConfig.FEATURES.HOME_PAGE && (
            <Route path="/home" element={<Home />} />
          )}
          <Route path="/services/contact" element={<Contact />} />
          <Route path="/details/:resourceId" element={<ResourceDetails />} />
          <Route path="/:resourceId" element={<ResourceDetails />} />
        </Routes>
        <Footer />
      </Container>
      <CookieNotice />
    </>
  )
}

export default App
