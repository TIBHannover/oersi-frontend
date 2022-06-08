import React from "react"
import initReactivesearch from "@appbaseio/reactivesearch/lib/server"
import ReactiveSearchComponents from "../src/config/ReactiveSearchComponents"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import Configuration from "../src/Configuration"
import {getResource} from "../src/api/backend/resources"
import {getSafeUrl} from "../src/helpers/helpers"
import ResourceDetails from "../src/views/ResourceDetails"
import Layout from "../src/Layout"

export async function getServerSideProps(context) {
  const translations = await serverSideTranslations(context.locale, [
    "translation",
    "language",
    "audience",
    "lrt",
    "subject",
  ])
  const {resourceId} = context.query
  const resourceResponse = await getResource(resourceId)
    .then((responseJson) => {
      if (!responseJson || !responseJson.name || !getSafeUrl(responseJson.id)) {
        return {
          jsonRecord: responseJson,
          error: {
            statusCode: 500,
            statusText: "Invalid json record",
          },
        }
      }
      return {
        jsonRecord: responseJson,
        error: null,
      }
    })
    .catch((err) => {
      return {
        jsonRecord: null,
        error: {
          statusCode: err.statusCode,
          statusText: err.statusText,
        },
      }
    })
  return {
    props: {
      ...translations,
      record: resourceResponse.jsonRecord,
      error: resourceResponse.error,
    },
  }
}

const DetailPage = (props) => {
  return <ResourceDetails record={props.record} error={props.error} />
}

export default DetailPage
