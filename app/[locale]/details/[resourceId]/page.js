import React from "react"
import DetailPage from "./details"
import {getResource} from "../../../../src/api/backend/resources"

async function getResourceResponse(resourceId) {
  console.log("getResourceResponse")
  return await getResource(resourceId)
    .then((responseJson) => {
      // TODO check baseFieldValues and safeUrl
      if (!responseJson || !responseJson.name || !responseJson.id) {
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
      console.log(err)
      return {
        jsonRecord: null,
        error: {
          statusCode: err.statusCode,
          statusText: err.statusText,
        },
      }
    })
}

export default async function Page({params: {resourceId}}) {
  const resourceResponse = await getResourceResponse(resourceId)
  console.log(resourceResponse)
  return (
    <DetailPage
      v
      record={resourceResponse.jsonRecord}
      error={resourceResponse.error}
    />
  )
}
