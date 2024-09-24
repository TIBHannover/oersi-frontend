import React from "react"
import {dir} from "i18next"
import {locales} from "../../src/i18nConfig"
import ConfiguredApp from "./configured-app"
import initTranslations from "../../src/i18n"
import TranslationsProvider from "./TranslationProvider"
import "../../public/css/style-override.css"

const i18nNamespaces = ["translation", "language", "labelledConcept", "data"]

export async function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export default async function RootLayout({children, params: {locale}}) {
  const {resources} = await initTranslations(locale, i18nNamespaces)

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <TranslationsProvider
          locale={locale}
          resources={resources}
          namespaces={i18nNamespaces}
        >
          {/* TODO: implement mui nextjs recommendation https://mui.com/material-ui/integrations/nextjs/#app-router */}
          <ConfiguredApp>{children}</ConfiguredApp>
        </TranslationsProvider>
      </body>
    </html>
  )
}
