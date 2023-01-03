import { PersonAdd, PersonOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useHandleError } from '../../hooks/useHandleError'
import {
  createNotification,
  followUser,
  unfollowUser
} from '../../utils/service-utils'

const ProfileButton = ({ type, userId }) => {
  const queryClient = useQueryClient()
  const { currentUser, setCurrentUser } = useAuthProvider()
  const { enqueueSnackbar } = useSnackbar()
  const currentUserId = currentUser?._id
  const {
    mutate: followMutate,
    isLoading: isFollowLoading,
    isError: isFollowError,
    error: followError
  } = useMutation(followUser, { onSuccess: () => onSuccess('new-follower') })
  const {
    mutate: unfollowMutate,
    isLoading: isUnfollowLoading,
    isError: isUnfollowError,
    error: unfollowError
  } = useMutation(unfollowUser, {
    onSuccess: () => onSuccess('new-unfollower')
  })
  useHandleError(isFollowError, followError)
  useHandleError(isUnfollowError, unfollowError)

  function toggleFollowings() {
    if (!currentUser) return
    const isUserIdExist = currentUser.following.includes(userId)
    setCurrentUser((currentUser) => ({
      ...currentUser,
      following: isUserIdExist
        ? currentUser.following.filter((id) => id !== userId)
        : [...currentUser.following, userId]
    }))
  }

  async function sendNotification(type) {
    const newObj = {
      senderId: currentUserId,
      receiverId: userId,
      type
    }

    try {
      await createNotification(newObj)
    } catch (error) {
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error'
      })
    }
  }

  function onSuccess(type) {
    queryClient.invalidateQueries(['best-friends'])
    sendNotification(type)
    toggleFollowings()
  }

  const buttonConfig = {
    variant: 'contained',
    sx: { textTransform: 'capitalize', m: 2, width: '50%' },
    loadingPosition: 'end'
  }

  const FollowButton = () => {
    return (
      <LoadingButton
        endIcon={<PersonAdd />}
        onClick={() => followMutate({ userId, currentUserId })}
        loading={isFollowLoading}
        {...buttonConfig}
      >
        Follow
      </LoadingButton>
    )
  }

  const UnfollowButton = () => {
    return (
      <LoadingButton
        endIcon={<PersonOff />}
        onClick={() => unfollowMutate({ userId, currentUserId })}
        loading={isUnfollowLoading}
        {...buttonConfig}
      >
        Unfollow
      </LoadingButton>
    )
  }

  switch (type) {
    case 'follow':
      return <FollowButton />
    case 'unfollow':
      return <UnfollowButton />
    default:
      return
  }
}

export default ProfileButton
