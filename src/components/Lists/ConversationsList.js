import styled from '@emotion/styled'
import { Delete, Email } from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  DialogActions,
  DialogContentText,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StyledLink } from '../../styled'
import { getFullName } from '../../utils/string-transforms-utils'
import CustomSkeleton from '../LoadingUI/CustomSkeleton'
import ConfirmDialog from '../ModalUI/ConfirmDialog'
import { useSnackbar } from 'notistack'
import { useOptimisticChatDelete } from '../../hooks/useOptimisticChatDelete'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../../hooks/useHandleError'
import { fetchMessageNotifications } from '../../utils/service-utils'
import { useHandlingUnreadMsgs } from '../../hooks/useHandlingUnreadMsgs'
import { useNavigate } from 'react-router-dom'

const StyledItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isCurrentChatPartner'
})(({ theme, isCurrentChatPartner }) => ({
  '& button[data-button-role="delete"]': {
    opacity: 0,
    transition: theme.transitions.create('opacity')
  },
  '&:hover': {
    backgroundColor: theme.palette.action.focus,
    '& button[data-button-role="delete"]': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('md')]: {
    '& button[data-button-role="delete"]': {
      opacity: 1
    }
  },
  backgroundColor: isCurrentChatPartner ? theme.palette.action.hover : 'inherit'
}))

const ConversationsList = ({
  data,
  isLoading,
  currentUserId,
  conversationId
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { mutate } = useOptimisticChatDelete(
    selectedConversation,
    currentUserId
  )
  const { mutate: clearNotificationsMutate } = useHandlingUnreadMsgs(
    conversationId,
    currentUserId
  )
  const { enqueueSnackbar } = useSnackbar()
  const {
    data: messages,
    isError,
    error
  } = useQuery(
    ['new-messages', currentUserId],
    () => fetchMessageNotifications(currentUserId),
    {
      enabled: !!currentUserId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)
  const unreadMessagesCount = useMemo(
    () => countUnreadMessages(messages),
    [messages]
  )

  const handleDialogOpen = (e, conversationId) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedConversation(conversationId)
    setIsConfirmDialogOpen(true)
  }

  const handleDialogClose = useCallback(() => {
    setIsConfirmDialogOpen(false)
    setSelectedConversation(null)
  }, [setIsConfirmDialogOpen, setSelectedConversation])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  function onSuccess(data) {
    enqueueSnackbar(data.data, { variant: 'success' })
    navigate('/chat')
  }

  function countUnreadMessages(messages) {
    return messages?.data.reduce((prev, cur) => {
      prev[cur.senderId] = (prev[cur.senderId] || 0) + 1
      return prev
    }, {})
  }

  const handleDelete = useCallback(() => {
    mutate(selectedConversation, {
      onSuccess
    })
    handleDialogClose()
  }, [selectedConversation])

  function getFilteredConversations(data) {
    if (!data?.data || data?.data.length === 0) return []
    return data.data
      .map((item) => {
        const member = item.members.find(
          (member) => member._id !== currentUserId
        )
        if (member) return { ...member, conversationId: item._id }
      })
      .filter((member) => {
        const query = member.name + member.lastName
        return query.includes(search.toLocaleLowerCase())
      })
  }

  function renderConversationsList(data) {
    if (data.length === 0) {
      return (
        <Typography color={'text.secondary'} marginTop={1}>
          No conversations yet
        </Typography>
      )
    }
    return data.map((item) => {
      const receiverFullName = getFullName(item.lastName, item.name)
      const isCurrentChatPartner = item.conversationId === conversationId
      const newMessagesNum = unreadMessagesCount?.[item._id]

      return (
        <StyledLink
          to={`/chat/${item.conversationId}`}
          key={item.conversationId}
          state={{ data: newMessagesNum }}
        >
          <StyledItemButton isCurrentChatPartner={isCurrentChatPartner}>
            <ListItemAvatar>
              <Avatar alt={receiverFullName} src={item.profilePicture} />
            </ListItemAvatar>
            <ListItemText primary={receiverFullName} />
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
            >
              <IconButton
                data-button-role="delete"
                onClick={(e) => handleDialogOpen(e, item.conversationId)}
              >
                <Delete />
              </IconButton>
              {!!newMessagesNum && (
                <IconButton>
                  <Badge badgeContent={newMessagesNum} color="error">
                    <Email />
                  </Badge>
                </IconButton>
              )}
            </ButtonGroup>
          </StyledItemButton>
        </StyledLink>
      )
    })
  }

  function handleUnreadMessageClear() {
    const currentUndeadChatMessages = messages?.data.some(
      (not) => not.meta.conversationId === conversationId
    )
    conversationId &&
      currentUserId &&
      currentUndeadChatMessages &&
      clearNotificationsMutate({ conversationId })
  }

  useEffect(() => {
    handleUnreadMessageClear()
  }, [conversationId, unreadMessagesCount])

  const filteredConversations = useMemo(
    () => getFilteredConversations(data),
    [data, search]
  )
  const conversationsList = useMemo(
    () => renderConversationsList(filteredConversations),
    [filteredConversations, conversationId, messages]
  )

  return (
    <Box p={2}>
      {isLoading || !currentUserId ? (
        <CustomSkeleton type="friends" count={3} />
      ) : (
        <>
          <TextField
            fullWidth
            label="Search for friends"
            variant="standard"
            onChange={handleChange}
            value={search}
          />
          <List>{conversationsList}</List>
          <ConfirmDialog
            open={isConfirmDialogOpen}
            handleClose={handleDialogClose}
            title="Please confirm your action!"
            renderDialogContent={() => (
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete this conversation? Otherwise,
                you and your chat partner will never be able to restore it.
              </DialogContentText>
            )}
            renderDialogActions={() => (
              <DialogActions>
                <Button onClick={handleDialogClose}>Disagree</Button>
                <Button onClick={handleDelete}>Agree</Button>
              </DialogActions>
            )}
          />
        </>
      )}
    </Box>
  )
}

export default ConversationsList
