import {Html, Head, Main, NextScript} from "next/document"
import React from "react"

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href={process.env.NEXT_PUBLIC_BASE_PATH + "/css/style-override.css"}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
