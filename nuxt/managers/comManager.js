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

async function getEvents() {
  const store = useStores();
  try {
    const response = await axios.get(`${url_api}/events/all`);
    const eventos = response.data.events;
    const eventosAgrupados = {};
    eventos.forEach((evento) => {
      const key = `${evento.artist}-${evento.date}`;
      if (
        !eventosAgrupados[key] ||
        evento.event.length < eventosAgrupados[key].event.length
      ) {
        eventosAgrupados[key] = evento;
      }
    });
    if (store.getLoggedIn()) {
      const likedEventIds = await getLikeEvents();
      Object.values(eventosAgrupados).forEach((evento) => {
        evento.like = likedEventIds.includes(evento.id);
      });

      store.setEvents(Object.values(eventosAgrupados));
    } else {
      store.setEvents(Object.values(eventosAgrupados));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getLikeEvents() {
  const store = useStores();
  const User = store.getUserInfo();
  try {
    const response = await axios.get(
      `${url_api_mongo}/likeEvents?userId=${User.id}`
    );
    // console.log(response.data);
    return response.data.map((like) => like.eventId);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function follow(userId) {
  const store = useStores();
  try {
    const token = store.getToken();
    const response = await axios.post(
      `${url_api}/users/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await getFolloweds();
    return response;
  } catch (error) {
    console.error("Error following user:", error);
  }
}

async function unfollow(userId) {
  const store = useStores();
  try {
    const token = store.getToken();
    const response = await axios.delete(`${url_api}/users/unfollow/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getFolloweds();
    return response;
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
}

async function getFollowers() {
  const store = useStores();
  try {
    const token = store.getToken();
    const response = await axios.get(`${url_api}/users/followers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
}

async function getFolloweds() {
  const store = useStores();
  try {
    const response = await axios.get(
      `${url_api}/users/followed/${store.getId()}`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken()}`,
        },
      }
    );
    store.setFollowed(response.data);
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
}

async function likeAnEvent(eventID) {
  const store = useStores();
  const User = store.getUserInfo();
  try {
    const response = await axios.post(`${url_api_mongo}/likeEvent`, {
      userId: User.id,
      eventId: eventID,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function unlikeAnEvent(eventID) {
  const store = useStores();
  const User = store.getUserInfo();
  try {
    const response = await axios.delete(
      `${url_api_mongo}/likeEvent?eventId=${eventID}&userId=${User.id}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function searchUsers(param) {
  try {
    const response = await axios.post(`${url_api}/apps/searchUsers`, {
      param: param,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function post(content, link) {
  const store = useStores();
  const userID = store.getId();
  try {
    await axios.post(`${url_api_mongo}/posts`, {
      content: content,
      userId: userID,
      image: link,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function deletePost(postID) {
  try {
    await axios.delete(`${url_api_mongo}/posts?postId=${postID}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getPosts(userID) {
  const store = useStores();

  try {
    const response = await axios.get(`${url_api_mongo}/posts?userId=${userID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getPostById(postID) {
  try {
    const response = await axios.get(`${url_api_mongo}/posts/${postID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getLikePosts(id) {
  const store = useStores();
  let userID = store.getId();

  if (id) {
    userID = id;
  }

  try {
    const response = await axios.get(
      `${url_api_mongo}/likePosts?userId=${userID}`
    );
    return response.data.map((like) => like.postId);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function likePost(postID) {
  const store = useStores();
  const userID = store.getId();
  try {
    await axios.post(`${url_api_mongo}/likePost`, {
      postId: postID,
      userId: userID,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function unlikePost(postID) {
  const store = useStores();
  const userID = store.getId();
  try {
    await axios.delete(
      `${url_api_mongo}/likePost?postId=${postID}&userId=${userID}`
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function commentPost(postID, content, userID) {
  try {
    await axios.post(`${url_api_mongo}/comments`, {
      postId: postID,
      content: content,
      userId: userID,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getComments(postID) {
  try {
    const response = await axios.get(
      `${url_api_mongo}/comments?postId=${postID}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getEventCounterFollowers(id) {
  try {
    const response = await axios.get(
      `${url_api_mongo}/likeEvents/${id}?eventId=${id}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getEventFollowers(id, page) {
  try {
    const response = await axios.get(
      `${url_api_mongo}/likeEvents/${id}/followers?p=${page}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getUserById(id, token) {
  try {
    const response = await axios.get(`${url_api}/users/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function uploadImage(image) {
  const reponse = await axios.post(`${url_api_mongo}/uploadImage`, image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return reponse.data;
}

const comManager = {
  getEvents,
  likeAnEvent,
  unlikeAnEvent,
  searchUsers,
  post,
  deletePost,
  getPosts,
  getLikePosts,
  likePost,
  unlikePost,
  getEventCounterFollowers,
  getEventFollowers,
  getUserById,
  follow,
  unfollow,
  getFollowers,
  getFolloweds,
  commentPost,
  getComments,
  getPostById,
  uploadImage,
};

export default comManager;
