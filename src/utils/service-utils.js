import { request } from './axios-utils'

export const registerUser = async (user) => {
  return await request({
    url: '/auth/register',
    method: 'POST',
    data: user
  })
}

export const loginUser = async (user) => {
  return await request({ url: '/auth/login', method: 'POST', data: user })
}

export const loginWithJWT = async (token) => {
  return await request({
    url: '/auth/login/withToken',
    headers: { Authorization: 'Bearer ' + token }
  })
}

export const fetchFriends = async (userId) => {
  return await request({ url: `/users/friends/${userId}` })
}

export const fetchUsers = async (userIds) => {
  return await request({ url: '/users', method: 'POST', data: { userIds } })
}

export const fetchUser = async (userId) => {
  return await request({ url: `/users/${userId}` })
}

export const fetchAllUsers = async (userId, filter) => {
  return await request({ url: `/users/get-all/${userId}?filter=${filter}` })
}

export const updateUser = async ({ userId, data }) => {
  return await request({ url: `/users/${userId}`, method: 'PUT', data })
}

export const followUser = async ({ userId, currentUserId }) => {
  return await request({
    url: `/users/follow/${userId}`,
    method: 'PUT',
    data: { currentUserId }
  })
}

export const unfollowUser = async ({ userId, currentUserId }) => {
  return await request({
    url: `/users/unfollow/${userId}`,
    method: 'PUT',
    data: { currentUserId }
  })
}

export const fetchTimeline = async (params) => {
  const searchParams = _getSearchParams(params.queryKey[1])
  const resParams = params.pageParam
    ? `${searchParams}&page=${params.pageParam}`
    : searchParams
  return await request({ url: `/post${resParams}` })
}

export const fetchPost = async (postId) => {
  return await request({ url: `/post/${postId}` })
}

export const toggleLikePost = async ({ postId, userId }) => {
  return await request({
    url: `/post/like/${postId}`,
    method: 'PUT',
    data: { userId }
  })
}

export const createPost = async (data) => {
  return await request({ url: '/post/create', method: 'POST', data })
}

export const deletePost = async ({ postId }) => {
  return await request({ url: `/post/delete/${postId}`, method: 'DELETE' })
}

export const createComment = async ({ data }) => {
  return await request({
    url: '/comments',
    method: 'POST',
    data
  })
}

export const fetchComments = async (params) => {
  const searchParams = _getSearchParams(params.queryKey[1])
  const resParams = params.pageParam
    ? `${searchParams}&page=${params.pageParam}`
    : searchParams
  return await request({ url: `/comments${resParams}` })
}

export const createNotification = async (data) => {
  return await request({
    url: '/notifications',
    method: 'POST',
    data
  })
}

export const fetchNotifications = async (receiverId) => {
  return await request({ url: `/notifications/${receiverId}` })
}

export const fetchMessageNotifications = async (receiverId) => {
  return await request({ url: `/notifications/${receiverId}?type=new-message` })
}

export const countMessages = async (receiverId) => {
  return await request({ url: `/notifications/messages/${receiverId}` })
}

export const clearUnreadMessageNotifications = async ({ conversationId }) => {
  return await request({
    url: `/notifications/messages/${conversationId}`,
    method: 'DELETE'
  })
}

export const clearNotifications = async ({ receiverId }) => {
  return await request({
    url: `/notifications/${receiverId}`,
    method: 'DELETE'
  })
}

export const fetchConversations = async (userId) => {
  return await request({ url: `/conversations/${userId}` })
}

export const deleteConversation = async (conversationId) => {
  return await request({
    url: `/conversations/${conversationId}`,
    method: 'DELETE'
  })
}

export const createConversation = async ({ senderId, receiverId }) => {
  return await request({
    url: '/conversations',
    method: 'POST',
    data: {
      senderId,
      receiverId
    }
  })
}

export const fetchMessages = async (conversationId) => {
  return await request({ url: `/messages/${conversationId}` })
}

export const sendMessage = async (data) => {
  return await request({
    url: '/messages',
    method: 'POST',
    data
  })
}

const _getSearchParams = (obj) => {
  const res = Object.entries(obj)
    .filter(([_key, value]) => !!value)
    .reduce((prev, [key, value], i) => {
      prev += i === 0 ? `?${key}=${value}` : `&${key}=${value}`
      return prev
    }, '')
  return res
}
