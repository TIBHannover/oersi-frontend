import React, {useState} from "react"
import Card from "react-bootstrap/Card"
import CardGroup from "react-bootstrap/CardGroup"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"
import {useTranslation} from "react-i18next"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {getValueForCurrentLanguage} from "../helpers/helpers"
import {useNavigate} from "react-router"

const SearchField = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [value, setValue] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    const newSearch = new URLSearchParams()
    if (value) {
      newSearch.set("search", '"' + value + '"')
    }
    navigate({
      pathname: "/",
      search: newSearch.toString(),
    })
  }

  return (
    <div className="homepage-search-component position-relative my-5 w-100">
      <Form onSubmit={onSubmit}>
        <FormControl
          className="search-component-input"
          aria-label="search"
          placeholder={t("HOME.SEARCH_PLACEHOLDER")}
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
  const keywords = i18n.exists("HOME.KEYWORDS")
    ? t("HOME.KEYWORDS", {returnObjects: true})
    : []

  return (
    <div className={"d-flex flex-column text-center align-items-center"}>
      <div className="h2 p-3">{t("HOME.TAGLINE")}</div>
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
      <SearchField />
    </div>
  )
}
const Feature = (props) => {
  const {t, i18n} = useTranslation()
  const {labelKey, links} = props

  return (
    <Card className="homepage-feature-component" border="primary">
      <Card.Header>
        <Card.Title>{t(labelKey + ".TITLE")}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>{t(labelKey + ".DESCRIPTION")}</Card.Text>
      </Card.Body>
      <Card.Footer>
        {links.map((link) => (
          <Card.Link
            key={link.labelKey}
            href={getValueForCurrentLanguage((lng) => link.url[lng], i18n)}
          >
            {t(labelKey + "." + link.labelKey)}
          </Card.Link>
        ))}
      </Card.Footer>
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
        <Row>
          <div className="d-flex flex-column align-items-center">
            <CardGroup className="py-3">
              {features.map((feature) => (
                <Feature key={feature.labelKey} {...feature} />
              ))}
            </CardGroup>
          </div>
        </Row>
      )}
    </Container>
  )
}

export default Home
