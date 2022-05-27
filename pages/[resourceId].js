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
  const elasticSearchConfig = {
    app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
    url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
  }
  const rs_data = await initReactivesearch(
    [
      {
        ...ReactiveSearchComponents.datasearch,
      },
      {
        ...ReactiveSearchComponents.resultcard,
      },
    ],
    context.query,
    elasticSearchConfig
  )
  const translations = await serverSideTranslations(context.locale, [
    "translation",
    "language",
    "audience",
    "lrt",
    "subject",
  ])
  if (!rs_data) {
    return {
      notFound: true,
    }
  }
  const rs_data_prep = JSON.parse(JSON.stringify(rs_data)) // workaround to make the data serializable
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
      reactiveSearchStore: rs_data_prep,
      record: resourceResponse.jsonRecord,
      error: resourceResponse.error,
    },
  }
}

const DetailPage = (props) => {
  return (
    <Configuration initialReactiveSearchState={props.reactiveSearchStore}>
      <Layout>
        <ResourceDetails record={props.record} error={props.error} />
      </Layout>
    </Configuration>
  )
}

export default DetailPage
