import React, {useEffect, useState} from "react"
import {Helmet} from "react-helmet"
import {withTranslation} from "react-i18next"
import {Box, Container, Paper, Typography} from "@material-ui/core"
import {getResource} from "../../service/backend/resources"
import {sort} from "json-keys-sort"

const MetaTags = (props) => {
  const {record, resourceId} = props
  return (
    <Helmet htmlAttributes={{prefix: "https://ogp.me/ns#"}}>
      <title>{record.name} - OERSI</title>
      {record.description && (
        <meta name="description" content={record.description} />
      )}

      <meta property="og:title" content={record.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={window.location.origin + process.env.PUBLIC_URL + "/" + resourceId}
      />
      <meta property="og:site_name" content="OERSI" />
      {record.description && (
        <meta property="og:description" content={record.description} />
      )}
      {record.image && <meta property="og:image" content={record.image} />}

      <meta name="twitter:card" content="summary" />

      <script type="application/ld+json">
        {JSON.stringify(sort(record), null, 2)}
      </script>
    </Helmet>
  )
}
const ResourceDetails = (props) => {
  const resourceId = props.match.params.resourceId
  const [isLoading, setIsLoading] = useState(true)
  const [record, setRecord] = useState({})

  useEffect(() => {
    const retrieveResource = async () => {
      setIsLoading(true)
      getResource(resourceId)
        .then((responseJson) => {
          setRecord(responseJson)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          // TODO error message
          setIsLoading(false)
        })
    }
    retrieveResource()
  }, [resourceId])

  return (
    <Container>
      {isLoading && "Loading..."}
      {!isLoading && (
        <Paper>
          <MetaTags record={record} resourceId={resourceId} />
          <Box p={2}>
            <Typography variant="h3" component="h1">
              {record.name ? record.name : ""}
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default withTranslation(["translation", "language", "lrt", "subject"])(
  ResourceDetails
)
