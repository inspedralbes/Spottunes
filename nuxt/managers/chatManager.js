import axios from "axios";
import { useStores } from "@/stores/counter.js";

let env = import.meta.env.VITE_APP_ENV;
let url_api;
let url_api_mongo;

if (env.toLowerCase() === "development") {
  url_api = import.meta.env.VITE_APP_API_DEV_URL;
  url_api_mongo = import.meta.env.VITE_APP_MONGO_API_DEV_URL;
} else if (env.toLowerCase() === "production") {
  url_api = import.meta.env.VITE_APP_API_PROD_URL;
  url_api_mongo = import.meta.env.VITE_APP_MONGO_API_PROD_URL;
}

async function getAllMessages(idChat) {
  try {
    const response = await axios.get(`${url_api}/messages/${idChat}`, {
      chat_id: idChat,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function checkChat(user_id, contact_id) {
  console.log("user_id", user_id);
  console.log("contact_id", contact_id);
  try {
    const response = await axios.post(`${url_api_mongo}/chat`, {
      user_id: user_id,
      contact_id: contact_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getFirst10Messages(chat_id) {
  try {
    const response = await axios.get(`${url_api_mongo}/messages`, {
      params: {
        chat_id: chat_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getMessages(chat_id, message_id) {
  try {
    const response = await axios.get(`${url_api_mongo}/get10messages`, {
      params: {
        chat_id: chat_id,
        message_id: message_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getChats(user_id) {
  try {
    const response = await axios.get(`${url_api_mongo}/chats`, {
      params: {
        user_id: user_id,
      },
    });
    return response.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
  }
}

async function getUserChats(user_id) {
  const store = useStores();

  try {
    const response = await axios.get(`${url_api}/getUser?user_id=${user_id}`, {
      headers: {
        Authorization: `Bearer ${store.getToken()}`,
      },
    });
    const obj_response = {
      nickname: response.data.nickname,
      avatar: response.data.avatar,
    };
    return obj_response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getLastMessage(chat_id) {
  try {
    const response = await axios.get(`${url_api_mongo}/lastMessage`, {
      params: {
        chat_id: chat_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getMessagesNotReceived(chat_id, user_id) {
  try {
    const response = await axios.get(
      `${url_api_mongo}/getMessagesNotReceived`,
      {
        params: {
          chat_id: chat_id,
          user_id: user_id,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function markMessagesAsReceived(chat_id, user_id) {
  try {
    const response = await axios.put(
      `${url_api_mongo}/markMessagesAsReceived`,
      {
        chat_id: chat_id,
        user_id: user_id,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function markMessagesAsRead(chat_id, user_id) {
  try {
    const response = await axios.put(`${url_api_mongo}/markMessagesAsRead`, {
      chat_id: chat_id,
      user_id: user_id,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

const comChat = {
  checkChat,
  getAllMessages,
  getFirst10Messages,
  getMessages,
  getChats,
  getUserChats,
  getLastMessage,
  getMessagesNotReceived,
  markMessagesAsReceived,
  markMessagesAsRead,
};

export default comChat;
