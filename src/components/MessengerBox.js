import { Box, Button, Divider, List, TextField } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHandleError } from '../hooks/useHandleError'
import BackdropLoading from './LoadingUI/BackdropLoading'
import { createNotification, fetchMessages } from '../utils/service-utils'
import { useOptimisticMessageData } from '../hooks/useOptimisticMessageData'
import { useAuthProvider } from '../contexts/AuthContext'
import { getFullName } from '../utils/string-transforms-utils'
import styled from '@emotion/styled'
import { useSnackbar } from 'notistack'
import { useLocation } from 'react-router-dom'
import { useSocketProvider } from '../contexts/SocketContext'
import { useHandlingUnreadMsgs } from '../hooks/useHandlingUnreadMsgs'
import Message from './Message'

export const StyledBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'flex-end',
  borderTop: `1px solid ${theme.palette.text.secondary}`,
  [theme.breakpoints.down('md')]: {
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    marginBottom: '56px',
    flexDirection: 'column'
  }
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.paper,
    paddingTop: '55px'
  }
}))

const MessengerBox = ({ conversationId, data: conversationData }) => {
  const { socket } = useSocketProvider()
  const { mutate } = useOptimisticMessageData(conversationId)
  const { currentUser } = useAuthProvider()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { state } = useLocation()
  const { mutate: clearNotificationsMutate } = useHandlingUnreadMsgs(
    conversationId,
    currentUser?._id
  )
  const { data, isLoading, isError, error } = useQuery(
    ['messages', conversationId],
    () => fetchMessages(conversationId),
    {
      enabled: !!conversationId,
      refetchOnWindowFocus: false
    }
  )
  const [isShowMessageDivider, setIsShowMessageDivider] = useState(
    !!state?.data
  )
  useHandleError(isError, error)

  const formRef = useRef()
  const scrollTriggerRef = useRef()
  const receiverId = useMemo(
    () => getReceiverId(conversationId, conversationData),
    [conversationId, conversationData]
  )

  const handleSetMessagesFromWS = useCallback((data) => {
    const { message, ...rest } = data
    const newMessage = {
      conversationId,
      createdAt: Date.now(),
      text: message,
      sender: rest
    }
    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      return {
        ...oldData,
        data: [
          ...oldData.data,
          { _id: oldData?.data?.length + 1, ...newMessage }
        ]
      }
    })
  }, [])

  function getReceiverId(conversationId, conversationData) {
    const currentConversation = conversationData?.data.find(
      (conversation) => conversation._id === conversationId
    )
    const receiver = currentConversation?.members.find(
      (user) => user._id !== currentUser?._id
    )
    return receiver?._id
  }

  function emitMessageToWS(text, fullName) {
    socket?.emit('send-message', {
      senderId: currentUser._id,
      receiverId,
      fullName,
      message: text,
      profilePicture: currentUser.profilePicture
    })
  }

  function onSuccess(text, fullName) {
    isShowMessageDivider && setIsShowMessageDivider(false)
    sendNotification()
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      emitMessageToWS(text, fullName)
    }
  }

  function handleClearUnreadMsgs() {
    const lastMsg = data?.data.at(-1)
    const isLastMsgFromFriend = lastMsg?.sender.senderId !== currentUser?._id
    if (isLastMsgFromFriend) clearNotificationsMutate({ conversationId })
  }

  async function sendNotification() {
    const newObj = {
      senderId: currentUser?._id,
      receiverId,
      type: 'new-message',
      meta: {
        conversationId
      }
    }

    try {
      await createNotification(newObj)
    } catch (error) {
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error'
      })
    }
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const text = formRef.current.text.value
    const fullName = getFullName(currentUser.lastName, currentUser.name)
    const sender = {
      senderId: currentUser._id,
      fullName,
      profilePicture: currentUser.profilePicture
    }
    mutate(
      {
        conversationId,
        sender,
        text
      },
      { onSuccess: () => onSuccess(text, fullName) }
    )
    formRef.current.reset()
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    scrollTriggerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data])

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      socket?.on('get-message', handleSetMessagesFromWS)
      return () => socket?.off('get-message', handleSetMessagesFromWS)
    }
  }, [handleSetMessagesFromWS])

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      handleClearUnreadMsgs()
    }
  }, [data, conversationId])

  if (isLoading || isError) return <BackdropLoading />

  return (
    <StyledWrapper paddingY={2}>
      <List sx={{ maxHeight: '70vh', overflowY: 'auto', paddingBottom: 0 }}>
        {data?.data.length === 0 && (
          <Box sx={{ width: '100%', paddingY: 8 }} component="li">
            <Divider>No messages yet</Divider>
          </Box>
        )}
        {data?.data.map((msg, i, arr) => (
          <Message
            key={msg._id || i}
            msg={msg}
            i={i}
            arr={arr}
            data={state?.data}
            currentUser={currentUser}
            isShowMessageDivider={isShowMessageDivider}
          />
        ))}
        <Divider ref={scrollTriggerRef} />
      </List>
      <StyledForm onSubmit={handleSubmit} ref={formRef}>
        <TextField
          label="What's your message?"
          name="text"
          id="text"
          required
          multiline
          onKeyDown={handleKeyPress}
          rows={3}
          variant="standard"
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ height: '20%', width: { xs: '100%', md: 'auto' } }}
          type="submit"
          size="small"
        >
          Send
        </Button>
      </StyledForm>
    </StyledWrapper>
  )
}

export default MessengerBox
