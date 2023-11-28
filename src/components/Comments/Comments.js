import SendCommentField from './SendCommentField'
import { useQuery } from '@tanstack/react-query'
import { fetchComments } from '../../utils/service-utils'
import { useHandleError } from '../../hooks/useHandleError'
import CustomPagination from '../PaginationUI/CustomPagination'
import { StyledBox } from '../../styled'
import { CardContent, CircularProgress, Collapse, List } from '@mui/material'
import SingleComment from './SingleComment'
import { useCallback, useEffect, useState } from 'react'
import { useThemeProvider } from '../../contexts/ThemeContext'

const Comments = ({
  comments,
  expanded,
  postId,
  userId,
  limit = 10,
  disableScroll = false
}) => {
  const { theme } = useThemeProvider()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = useQuery(
    [`comments`, { postId, limit }, page],
    ({ pageParam = page, queryKey }) => fetchComments({ queryKey, pageParam }),
    {
      enabled: expanded,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  )
  useHandleError(isError, error)

  const totalPages = data?.data.totalPages || 1

  const handleChange = useCallback((_event, value) => {
    setPage(value)
  })

  useEffect(() => {
    if (!expanded && !disableScroll) {
      let timer = setTimeout(
        () => setPage(1),
        theme.transitions.duration.standard
      )
      return () => {
        clearTimeout(timer)
      }
    }
  }, [expanded])

  return (
    <Collapse in={expanded && !isLoading} timeout="auto" unmountOnExit>
      <CardContent sx={{ p: { xs: 0, sm: 2 } }}>
        <List>
          {isLoading ? (
            <StyledBox component="li">
              <CircularProgress />
            </StyledBox>
          ) : (
            data?.data.comments.map((com) => (
              <SingleComment key={com._id} {...com} />
            ))
          )}
          <SendCommentField
            expanded={expanded}
            postId={postId}
            page={page}
            userId={userId}
            disableScroll={disableScroll}
          />
        </List>
      </CardContent>
      {comments.length > 5 && (
        <StyledBox sx={{ paddingBottom: 1 }}>
          <CustomPagination count={totalPages} handleChange={handleChange} />
        </StyledBox>
      )}
    </Collapse>
  )
}

export default Comments
