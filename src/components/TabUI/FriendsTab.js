import { Forum } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  IconButton,
  List,
  ListItemSecondaryAction,
  Tab,
  Tooltip
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useHandleError } from '../../hooks/useHandleError'
import { renderFriendLinks } from '../../utils/render-items-utils'
import {
  createConversation,
  createNotification
} from '../../utils/service-utils'
import FriendsList from '../Lists/FriendsList'
import OnlineFriendsList from '../Lists/OnlineFriendsList'

const FriendsTab = ({ data, isConversationLoading }) => {
  const { currentUser } = useAuthProvider()
  const queryClient = useQueryClient()
  const currentUserId = currentUser?._id
  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync, isError, error, isLoading } = useMutation(
    createConversation,
    { onSuccess }
  )
  const [value, setValue] = useState('1')
  useHandleError(isError, error)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  function onSuccess() {
    queryClient.invalidateQueries(['conversations'])
  }

  async function handleCreate(e, receiverId) {
    e.preventDefault()
    const newConversation = await mutateAsync({
      senderId: currentUserId,
      receiverId
    })
    await sendNotification(receiverId, newConversation?.data._id)
  }

  function checkConversationMember(userId) {
    if (!data?.data.length) return
    return data?.data.some((item) => {
      return item.members.some((member) => {
        return member._id === userId
      })
    })
  }

  async function sendNotification(receiverId, conversationId) {
    const newObj = {
      senderId: currentUserId,
      receiverId,
      type: 'new-conversation',
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

  function renderActions(receiverId) {
    const isUserExist = checkConversationMember(receiverId)
    if (isUserExist) return
    return (
      <ListItemSecondaryAction>
        <Tooltip title="Add user to conversations">
          <span>
            <IconButton
              edge="end"
              onClick={(e) => handleCreate(e, receiverId)}
              aria-label="Start conversation"
              disabled={isLoading || isConversationLoading}
            >
              <Forum />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemSecondaryAction>
    )
  }

  function renderMessengerFriendsList(friends, renderActions) {
    return (
      <List disablePadding>{renderFriendLinks(friends, renderActions)}</List>
    )
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1', pr: 2 }}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange} centered>
            <Tab label="Online friends" value="1" sx={{ flex: 1 }} />
            <Tab label="All friends" value="2" sx={{ flex: 1 }} />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <OnlineFriendsList
            renderOnlineFriendsList={(friends) =>
              renderMessengerFriendsList(friends, renderActions)
            }
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <FriendsList
            renderFriendsList={(friends) =>
              renderMessengerFriendsList(friends, renderActions)
            }
          />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default FriendsTab
