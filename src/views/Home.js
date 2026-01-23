import React, {useCallback, useMemo, useState} from "react"
import {useSearchBox} from "react-instantsearch"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"
import {useTranslation} from "react-i18next"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {getValueForCurrentLanguage} from "../helpers/helpers"
import {useNavigate} from "react-router"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import PluginIcon from "../components/icons/PluginIcon"
import PlusCircleFillIcon from "../components/icons/PlusCircleFillIcon"
import PlusCircleIcon from "../components/icons/PlusCircleIcon"
import SearchIcon from "../components/icons/SearchIcon"
import {useCustomStats} from "../api/backend/resources"
import Spinner from "react-bootstrap/Spinner"

const SearchField = (props) => {
  const {resourcesTotal} = props
  const {t} = useTranslation()
  const {routes} = React.useContext(SearchIndexFrontendConfigContext)
  const navigate = useNavigate()
  const [value, setValue] = useState("")
  const {refine} = useSearchBox()

  const placeholderText = useMemo(() => {
    if (resourcesTotal) {
      return t("HOME.SEARCH_PLACEHOLDER_WITH_STATS", {
        total: resourcesTotal,
      })
    }
    return t("HOME.SEARCH_PLACEHOLDER")
  }, [resourcesTotal, t])

  const onSubmit = (e) => {
    e.preventDefault()
    const newSearch = new URLSearchParams()
    if (value) {
      newSearch.set("search", JSON.stringify(value))
      refine(value)
    }
    navigate({pathname: routes.SEARCH, search: newSearch.toString()})
  }

  return (
    <div className="homepage-search-component position-relative my-5 w-100">
      <Form onSubmit={onSubmit}>
        <FormControl
          className="search-component-input bg-body-secondary border-primary border-2"
          aria-label="search"
          size="lg"
          placeholder={placeholderText}
          onChange={({target: {value}}) => setValue(value)}
          value={value}
        />
        <button className="search-icon-wrapper" onClick={onSubmit}>
          <svg
            className="search-icon"
            height="12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            style={{transform: "scale(1.35)", position: "relative", right: "0.4rem"}}
          >
            <title>Search</title>
            <path d=" M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609, 0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021, 0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338, 4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z "></path>
          </svg>
        </button>
      </Form>
    </div>
  )
}
const SearchSection = ({stats}) => {
  const {t, i18n} = useTranslation()
  const keywords = i18n.exists("HOME.KEYWORDS")
    ? t("HOME.KEYWORDS", {returnObjects: true})
    : []

  return (
    <div className={"d-flex flex-column text-center align-items-center"}>
      <div className="homepage-component-tagline fw-bold display-3 p-3">
        {t("HOME.TAGLINE")}
      </div>
      {keywords && (
        <div>
          <Stack direction="horizontal" gap={1} className="flex-wrap fs-5">
            {keywords.map((keyword) => (
              <span key={keyword} className="badge bg-secondary">
                {keyword}
              </span>
            ))}
          </Stack>
        </div>
      )}
      {<SearchField resourcesTotal={stats?.total} />}
    </div>
  )
}
const Feature = (props) => {
  const {t, i18n} = useTranslation()
  const {labelKey, iconId, links} = props
  const getIcon = useCallback((iconId) => {
    if (iconId && iconId === "Plugin") {
      return <PluginIcon />
    } else if (iconId && iconId === "PlusCircle") {
      return <PlusCircleIcon />
    } else if (iconId && iconId === "Search") {
      return <SearchIcon />
    } else if (iconId && iconId === "PlusCircleFill") {
      return <PlusCircleFillIcon />
    }
    return null
  }, [])
  const icon = getIcon(iconId)

  return (
    <Card className="homepage-feature-component border-primary">
      {icon && (
        <Card.Img className="homepage-feature-image align-self-center p-3" as="div">
          {icon}
        </Card.Img>
      )}
      <Card.Body>
        <Card.Title>{t(labelKey + ".TITLE")}</Card.Title>
        <Card.Text>{t(labelKey + ".DESCRIPTION")}</Card.Text>
        {links.map((link) => (
          <Button
            key={link.labelKey}
            href={getValueForCurrentLanguage((lng) => link.url[lng], i18n)}
          >
            {t(labelKey + "." + link.labelKey)}
          </Button>
        ))}
      </Card.Body>
    </Card>
  )
}
const Stats = (props) => {
  const {t} = useTranslation()
  const {labelKey, tooltipLabelKey, value, postfix} = props
  return (
    <Card.Body className="align-content-center" title={t(tooltipLabelKey)}>
      <Card.Title>
        {value ? (
          value + (postfix || "")
        ) : (
          <Spinner aria-label="loading-spinner" animation="border" size="sm" />
        )}
      </Card.Title>
      <Card.Subtitle className="text-muted">{t(labelKey)}</Card.Subtitle>
    </Card.Body>
  )
}

const Home = () => {
  const {homePage} = React.useContext(SearchIndexFrontendConfigContext)
  return homePage.useStats ? <HomeContentWithStats /> : <HomeContent />
}
const HomeContentWithStats = () => {
  const {homePage} = React.useContext(SearchIndexFrontendConfigContext)
  const stats = useCustomStats(homePage?.stats)
  return <HomeContent stats={stats} />
}
const HomeContent = ({stats}) => {
  const {homePage} = React.useContext(SearchIndexFrontendConfigContext)
  const features = homePage?.features

  return (
    <Container className="my-3 homepage-component">
      <Row className="py-3">
        <SearchSection stats={stats} />
      </Row>
      {homePage.stats && (
        <Row className="homepage-component-stats-section mb-5 text-center justify-content-center g-3">
          {homePage.stats.map((statConfig) => (
            <Col xs={4} md={3} lg={2} key={statConfig.id}>
              <Stats {...statConfig} value={stats ? stats[statConfig.id] : null} />
            </Col>
          ))}
        </Row>
      )}
      {features && (
        <Row className="homepage-component-features-section p-3 justify-content-center g-3">
          {features.map((feature) => (
            <Col xs={12} md={6} lg={6} xl={4} xxl={4} key={feature.labelKey}>
              <Feature {...feature} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Home
