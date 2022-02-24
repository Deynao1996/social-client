import {useHttp} from './http.hook.js';

const useService = () => {
  const {itemLoadingStatus, request, clearError} = useHttp();

  const _apiBase = 'http://localhost:5000/api';

  const registerUser = async (user) => {
    const newUser = await request(`${_apiBase}/auth/register`, false, 'POST', user);
    return newUser;
  };

  const loginUser = async (user) => {
    const newUser = await request(`${_apiBase}/auth/login`, false, 'POST', user);
    return newUser;
  };

  const loginWithJWT = async (token) => {
    const newUser = await request(`${_apiBase}/auth/login/withToken`, false, 'GET', null, {'Token': 'barer ' + token});
    return newUser;
  };

  const getFriends = async (userId) => {
    const followers = await request(`${_apiBase}/users/friends/${userId}`);
    return followers;
  };
  
  const getUser = async (userId) => {
    const user = await request(`${_apiBase}/users/get/${userId}`);
    return user;
  };

  const getAllUsers = async () => {
    const users = await request(`${_apiBase}/users/getAll`);
    return users;
  };

  const followUser = async (friendId, currentUserId) => {
    const response = await request(`${_apiBase}/users/follow/${friendId}`, false, 'PUT', currentUserId);
    return response;
  };

  const unFollowUser = async (friendId, currentUserId) => {
    const response = await request(`${_apiBase}/users/unfollow/${friendId}`, false, 'PUT', currentUserId);
    return response;
  };

  const updateUser = async (userId, body) => {
    const user = await request(`${_apiBase}/users/update/${userId}`, false, 'PUT', body);
    return user;
  };

  const createPost = async (body) => {
    const post = await request(`${_apiBase}/post/create`, true, 'POST', body);
    return post;
  };
  
  const getTimelinePosts = async (userId) => {
    const posts = await request(`${_apiBase}/post/timeline/${userId}`);
    return posts;
  };

  const toggleLikePost = async (postId, userId) => {
    const response = await request(`${_apiBase}/post/like/${postId}`, false, 'PUT', userId);
    return response;
  };
  
  const deletePost = async (postId) => {
    const response = await request(`${_apiBase}/post/delete/${postId}`, false, 'DELETE');
    return response;
  };
  
  const updateComment = async (postId, body) => {
    const comment = await request(`${_apiBase}/post/comment/${postId}`, false, 'PUT', body);
    return comment;
  };

  const getConversations = async (userId) => {
    const conversations = await request(`${_apiBase}/conversations/${userId}`, false);
    return conversations;
  };
  
  const createConversation = async (body) => {
    const conversations = await request(`${_apiBase}/conversations/`, false, 'POST', body);
    return conversations;
  };

  const deleteConversation = async (conversationId) => {
    const response = await request(`${_apiBase}/conversations/delete/${conversationId}`, false, 'DELETE');
    return response;
  };
 
  const getMessages = async (conversationId) => {
    const messages = await request(`${_apiBase}/messages/${conversationId}`);
    return messages;
  };
  
  const sendMessage = async (body) => {
    const message = await request(`${_apiBase}/messages`, false, 'POST', body);
    return message;
  };
  

  return {
    itemLoadingStatus, 
    getTimelinePosts, 
    getUser, 
    getFriends, 
    registerUser, 
    loginUser, 
    clearError,
    createPost, 
    loginWithJWT, 
    toggleLikePost,
    followUser,
    updateUser,
    unFollowUser,
    getAllUsers,
    updateComment,
    deletePost,
    getConversations,
    createConversation,
    deleteConversation,
    getMessages,
    sendMessage
  }
};

export default useService;
