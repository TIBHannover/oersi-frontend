import Card from "react-bootstrap/Card"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import Pagination from "react-bootstrap/Pagination"
import {useTranslation} from "react-i18next"

const usePagination = (props) => {
  const {page, count, pageSize, siblingCount = 1} = props

  const maxScrollableResults = 10000
  const maxScrollablePage = Math.floor(maxScrollableResults / pageSize)

  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({length}, (_, i) => start + i)
  }
  const startPages = range(1, Math.min(1, count))
  const endPages = range(Math.max(count, 2), count)
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - 1 - siblingCount * 2 - 1),
    3
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, 1 + siblingCount * 2 + 2),
    count - 2
  )
  const items = [
    ...startPages,
    ...(siblingsStart > 3 ? ["ellipsis"] : 2 < count - 1 ? [2] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - 2 ? ["ellipsis"] : count - 1 > 1 ? [count - 1] : []),
    ...endPages,
  ]
  return {
    items: items.map((item, index) => {
      return {
        page: item,
        key: item + index,
        disabled: item > maxScrollablePage,
      }
    }),
    maxScrollablePage: maxScrollablePage,
  }
}

const PageControl = (props) => {
  const {t} = useTranslation()
  const pageCount = Math.ceil(props.total / props.pageSize)
  const currentRangeStart = Math.min(
    (props.page - 1) * props.pageSize + 1,
    props.total
  )
  const currentRangeEnd = Math.min(props.page * props.pageSize, props.total)
  const {items, maxScrollablePage} = usePagination({
    page: props.page,
    count: pageCount,
    pageSize: props.pageSize,
    siblingCount: 1,
  })

  return (
    <Card className="py-2 my-2">
      <div className="align-self-center">
        {t("RESULT_LIST.SHOW_TOTAL", {
          rangeStart: currentRangeStart,
          rangeEnd: currentRangeEnd,
          total: props.total,
        })}
      </div>
      <div className="d-flex flex-wrap justify-content-center p-1 gap-1">
        <Pagination
          className="m-0 z-0"
          role="navigation"
          aria-label="pagination navigation"
        >
          <Pagination.Prev
            aria-label={"go to prev page"}
            onClick={() => props.onChangePage(props.page - 1)}
            disabled={props.page <= 1}
          />
          {items.map((item) =>
            item.page === "ellipsis" ? (
              <Pagination.Ellipsis key={item.key} disabled />
            ) : (
              <Pagination.Item
                key={item.key}
                aria-label={"go to page " + item.page}
                active={item.page == props.page}
                disabled={item.disabled}
                onClick={() => props.onChangePage(item.page)}
              >
                {item.page}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            aria-label={"go to next page"}
            onClick={() => props.onChangePage(props.page + 1)}
            disabled={props.page + 1 > maxScrollablePage}
          />
        </Pagination>
        <DropdownButton
          variant="outline-primary"
          title={t("RESULT_LIST.PAGE_SIZE_SELECTION", {size: props.pageSize})}
          aria-label="page size selection"
          onSelect={(value) => props.onChangePageSize(value)}
        >
          {props.pageSizeOptions.map((v) => (
            <Dropdown.Item key={v} eventKey={v} aria-label={"select page size " + v}>
              {t("RESULT_LIST.PAGE_SIZE_SELECTION", {size: v})}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
    </Card>
  )
}
export default PageControl
