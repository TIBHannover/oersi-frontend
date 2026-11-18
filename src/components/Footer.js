import React, {useCallback} from "react"
import {useTranslation} from "react-i18next"

import {getValueForCurrentLanguage} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import Container from "react-bootstrap/Container"
import EnvelopeFillIcon from "./icons/EnvelopeFillIcon"
import GitLabIcon from "./icons/GitLabIcon"
import MastodonIcon from "./icons/MastodonIcon"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import {Link} from "react-router"

const Footer = () => {
  const {footer} = React.useContext(SearchIndexFrontendConfigContext)
  const {t} = useTranslation()
  return (
    <footer className="footer footer-background-color mt-3">
      <Container className="footer-content p-4">
        <div>
          <p className="h5 fw-bold">{t("FOOTER.HEADING")}</p>
          <hr />
          <div>{t("FOOTER.DESCRIPTION")}</div>
        </div>
        <Row className="footer-links">
          <Col>
            <ul className="p-0 my-3">
              {footer?.links?.map((link) => (
                <LinkListItem
                  key={link.label || link.labelKey}
                  iconId={link.iconId}
                  label={link.labelKey ? t(link.labelKey) : link.label}
                  href={link.href}
                  target={link.target}
                  reloadDocument={link.reloadDocument}
                />
              ))}
            </ul>
          </Col>
          <Col>
            <ul className="p-0 my-3">
              <LinkListItem label={t("FOOTER.IMPRINT")} href={footer?.imprint} />
              <LinkListItem
                label={t("FOOTER.PRIVACY_POLICY")}
                href={footer?.privacyPolicy}
              />
              <LinkListItem
                label={t("FOOTER.ACCESSIBILITY")}
                href={footer?.accessibilityStatement}
              />
            </ul>
          </Col>
        </Row>
        <hr />
        <div className="footer-logos d-flex flex-wrap justify-content-center">
          {footer?.logos?.map((logo) => (
            <Logo
              key={logo.altText}
              src={logo.src}
              alt={logo.altText}
              href={logo.href}
              width={logo.width}
              height={logo.height}
            />
          ))}
        </div>
      </Container>
    </footer>
  )
}

function getValueFromMultilingualField(field, i18n) {
  if (typeof field === "string") {
    return field
  }
  return getValueForCurrentLanguage((lng) => field[lng], i18n)
}

const Logo = ({src, alt, href, width, height}) => {
  const {i18n} = useTranslation()
  const img = <img src={src} alt={alt} height={height || 60} width={width || null} />
  return (
    <div className="footer-logo p-3" key={src}>
      {href ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getValueFromMultilingualField(href, i18n)}
        >
          {img}
        </a>
      ) : (
        <div>{img}</div>
      )}
    </div>
  )
}
const LinkListItem = ({href, label, iconId, target, reloadDocument}) => {
  const {i18n} = useTranslation()
  const getIcon = useCallback((iconId) => {
    if (iconId && iconId === "Envelope") {
      return <EnvelopeFillIcon width="24" height="24" />
    } else if (iconId && iconId === "GitLab") {
      return <GitLabIcon width="24" height="24" />
    } else if (iconId && iconId === "Mastodon") {
      return <MastodonIcon width="24" height="24" />
    }
    return null
  }, [])
  const content = getIcon(iconId) || label
  return href ? (
    <li className="d-inline-block pe-4 py-3">
      <Link
        rel="noopener noreferrer"
        to={getValueFromMultilingualField(href, i18n)}
        title={content === label ? null : label}
        aria-label={label}
        target={target}
        reloadDocument={reloadDocument === undefined ? true : reloadDocument}
      >
        {content}
      </Link>
    </li>
  ) : null
}

export default Footer
