import axios from "axios";


const MessageAPI = axios.create({
  baseURL: "https://knox-backend-2.onrender.com/api/chat",
  withCredentials: true,
});

export const getMessagesByConversationId = (conversationId) =>
  MessageAPI.get(`/${conversationId}`);
