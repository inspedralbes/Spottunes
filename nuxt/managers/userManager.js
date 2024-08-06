import axios from "axios";
import { useStores } from "@/stores/counter.js";

let env = import.meta.env.VITE_APP_ENV;
let url_api;

if (env.toLowerCase() === "development") {
  url_api = import.meta.env.VITE_APP_API_DEV_URL;
} else if (env.toLowerCase() === "production") {
  url_api = import.meta.env.VITE_APP_API_PROD_URL;
}

async function updateUser(user, token) {
  try {
    const response = await axios.put(
      `${url_api}/updateInfo`,
      {
        name: user.name,
        nickname: user.nickname,
        surnames: user.surnames,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
        // private: user.private,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function getFollowers(id) {
  const store = useStores();
  let userID = id ? id : store.getId();
  try {
    const response = await axios.get(`${url_api}/users/followers/${userID}`, {
      headers: {
        Authorization: `Bearer ${store.getToken()}`,
      },
    });
    if (userID === store.getId()) {
      store.setFollowers(response.data);
    } else {
      store.setOtherFollowers(response.data);
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
}

async function getFollowed(id) {
  const store = useStores();
  let userID = id ? id : store.getId();
  try {
    const response = await axios.get(`${url_api}/users/followed/${userID}`, {
      headers: {
        Authorization: `Bearer ${store.getToken()}`,
      },
    });
    if (userID === store.getId()) {
      store.setFollowed(response.data);
    } else {
      store.setOtherFollowed(response.data);
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
}

async function searchUsers(user) {
  try {
    const response = await axios.get(`${url_api}/users/search/${user}`, {
      headers: {
        Authorization: `Bearer ${store.getToken()}`,
      },
    });
    store.setOtherUserInfo(response.data);
  } catch (error) {
    console.error("Error searching users:", error);
  }
}

async function convertGeolocation(lat, lng) {
  const store = useStores();
  const mapboxToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: mapboxToken,
        language: "es", // Para obtener los resultados en español
      },
    });
    const features = response.data.features;

    // Inicializamos variables para ciudad, provincia y país
    let city = "";
    let province = "";
    let country = "";

    if (features && features.length > 0) {
      // Iteramos sobre las características para encontrar los datos deseados
      features.forEach((feature) => {
        if (feature.place_type.includes("place")) {
          city = feature.text;
        } else if (feature.place_type.includes("region")) {
          province = feature.text;
        } else if (feature.place_type.includes("country")) {
          country = feature.text;
        }
      });
    }

    const location = {
      latitude: lat,
      longitude: lng,
      city: city,
      province: province.replace("província de ", ""),
      country: country,
    };

    store.setUserLocation(location);

    // Retornamos un objeto con los datos requeridos
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const userManager = {
  updateUser,
  getFollowers,
  getFollowed,
  convertGeolocation,
  searchUsers,
};

export default userManager;
