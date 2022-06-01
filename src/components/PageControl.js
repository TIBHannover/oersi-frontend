import React from "react"
import {
  Box,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Typography,
  useTheme,
} from "@mui/material"
import {useTranslation} from "next-i18next"

const PageControl = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const pageCount = Math.ceil(props.total / props.pageSize)
  const currentRangeStart = Math.min(
    (props.page - 1) * props.pageSize + 1,
    props.total
  )
  const currentRangeEnd = Math.min(props.page * props.pageSize, props.total)

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
      }}
    >
      <Box sx={{alignSelf: "center"}}>
        <Typography>
          {t("RESULT_LIST.SHOW_TOTAL", {
            rangeStart: currentRangeStart,
            rangeEnd: currentRangeEnd,
            total: props.total,
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignSelf: "center",
          justifyContent: "center",
          padding: theme.spacing(1),
        }}
      >
        <Pagination
          sx={{alignSelf: "center", marginX: theme.spacing(1)}}
          count={pageCount > 0 ? pageCount : 1}
          page={props.page}
          onChange={(event, value) => props.onChangePage(value)}
        />
        <Select
          sx={{alignSelf: "center"}}
          value={props.pageSize}
          size="small"
          displayEmpty
          onChange={(event) => props.onChangePageSize(event.target.value)}
        >
          {props.pageSizeOptions.map((v) => (
            <MenuItem key={v} value={v}>
              {t("RESULT_LIST.PAGE_SIZE_SELECTION", {size: v})}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Paper>
  )
}
export default PageControl
