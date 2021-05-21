import React, {useEffect, useState} from "react"
import {withTranslation} from "react-i18next"
import {Box, Container, Paper, Typography} from "@material-ui/core"
import {getResource} from "../../service/backend/resources"

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
