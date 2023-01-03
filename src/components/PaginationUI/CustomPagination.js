import { Pagination } from '@mui/material'

const CustomPagination = ({ count, handleChange, page }) => {
  return (
    <Pagination
      count={count}
      size="small"
      onChange={handleChange}
      page={page}
    />
  )
}

export default CustomPagination
