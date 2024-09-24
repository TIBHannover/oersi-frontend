"use client"

import Configuration from "../../src/Configuration"
import Layout from "../../src/Layout"
import React from "react"

export default function ConfiguredApp({children}) {
  return (
    <Configuration>
      <Layout>{children}</Layout>
    </Configuration>
  )
}
