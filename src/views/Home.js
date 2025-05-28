import React, {useCallback, useMemo, useState} from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"
import {ReactiveComponent} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {getValueForCurrentLanguage} from "../helpers/helpers"
import {useNavigate} from "react-router"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import PluginIcon from "../components/icons/PluginIcon"
import PlusCircleFillIcon from "../components/icons/PlusCircleFillIcon"
import PlusCircleIcon from "../components/icons/PlusCircleIcon"

const SearchField = (props) => {
  const {resourcesTotal, resourcesQueryResult} = props
  const {t} = useTranslation()
  const {routes} = React.useContext(SearchIndexFrontendConfigContext)
  const navigate = useNavigate()
  const [value, setValue] = useState("")

  const placeholderText = useMemo(() => {
    if (resourcesTotal && resourcesQueryResult) {
      return t("HOME.SEARCH_PLACEHOLDER_WITH_STATS", {
        total: resourcesTotal,
        queryResult: resourcesQueryResult,
      })
    }
    return t("HOME.SEARCH_PLACEHOLDER")
  }, [resourcesQueryResult, resourcesTotal, t])

  const onSubmit = (e) => {
    e.preventDefault()
    const newSearch = new URLSearchParams()
    if (value) {
      newSearch.set("search", '"' + value + '"')
    }
    navigate({
      pathname: routes.SEARCH,
      search: newSearch.toString(),
    })
  }

  return (
    <div className="homepage-search-component position-relative my-5 w-100">
      <Form onSubmit={onSubmit}>
        <FormControl
          className="search-component-input search-component-main"
          aria-label="search"
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
            style={{transform: "scale(1.35)", position: "relative"}}
          >
            <title>Search</title>
            <path d=" M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609, 0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021, 0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338, 4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z "></path>
          </svg>
        </button>
      </Form>
    </div>
  )
}
const SearchSection = () => {
  const {t, i18n} = useTranslation()
  const {homePage} = React.useContext(SearchIndexFrontendConfigContext)
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
      {homePage.useStats && homePage.statsQuery ? (
        <ReactiveComponent
          componentId="homePageStats"
          defaultQuery={() => ({
            aggs: {
              resourceQuery: homePage.statsQuery,
            },
          })}
          render={({aggregations, resultStats}) => {
            return (
              <SearchField
                resourcesTotal={resultStats?.numberOfResults}
                resourcesQueryResult={aggregations?.resourceQuery?.value}
              />
            )
          }}
        />
      ) : (
        <SearchField />
      )}
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
    } else if (iconId && iconId === "PlusCircleFill") {
      return <PlusCircleFillIcon />
    }
    return null
  }, [])
  const icon = getIcon(iconId)

  return (
    <Card className="homepage-feature-component">
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

const Home = () => {
  const {homePage} = React.useContext(SearchIndexFrontendConfigContext)
  const features = homePage?.features

  return (
    <Container className="my-3 homepage-component">
      <Row className="py-3">
        <SearchSection />
      </Row>
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
