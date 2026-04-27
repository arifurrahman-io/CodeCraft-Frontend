import api, { request } from "@/services/api";
import { asArray } from "@/services/resourceService";

const endpoint = "/contacts";

const normalizeMessage = (message) => {
  if (!message || typeof message !== "object") return message;
  const status = message.status || (message.isRead ? "read" : "unread");

  return {
    ...message,
    isRead: message.isRead ?? status === "read",
    status,
  };
};

export const getAllMessages = async () => {
  const response = await request(api.get(endpoint));
  return {
    ...response,
    data: asArray(response.data).map(normalizeMessage),
  };
};

export const getUnreadMessagesCount = async () => {
  const response = await getAllMessages();
  return {
    data: {
      count: response.data.filter((message) => !message.isRead).length,
    },
  };
};

export const getMessageById = async (id) => {
  const response = await request(api.get(`${endpoint}/${id}`));
  return {
    ...response,
    data: normalizeMessage(response.data),
  };
};

export const sendMessage = (messageData) => request(api.post(endpoint, messageData));

export const markMessageAsRead = (id) =>
  request(
    api.put(`${endpoint}/${id}/status`, {
      status: "read",
      isRead: true,
    }),
  );

export const deleteMessage = (id) => request(api.delete(`${endpoint}/${id}`));

export { api };

export default {
  getAllMessages,
  getUnreadMessagesCount,
  getMessageById,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
};
