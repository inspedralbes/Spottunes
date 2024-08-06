import axios from "axios";

let env = import.meta.env.VITE_APP_ENV;
let url_api;

if (env.toLowerCase() === "development") {
  url_api = import.meta.env.VITE_APP_API_DEV_URL;
} else if (env.toLowerCase() === "production") {
  url_api = import.meta.env.VITE_APP_API_PROD_URL;
}

async function getSpotifyToken(code, state) {
  let spotifyData = {};
  const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;

  const authHeader = "Basic " + btoa(`${clientId}:${clientSecret}`);

  const authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: new URLSearchParams({
      code: code,
      redirect_uri: import.meta.env.VITE_APP_SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authHeader,
    },
  };

  try {
    const responseToken = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });

    spotifyData.tokenInfo = responseToken.data;

    // Devolver una nueva promesa para esperar la solicitud GET
    return new Promise((resolve, reject) => {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${responseToken.data.access_token}`,
          },
        })
        .then((response) => {
          spotifyData.userInfo = response.data;
          spotifyData.userInfo.loginWith = "spotify";
          resolve(spotifyData);
        })
        .catch((error) => {
          console.error("Error making request to Spotify API:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error during Spotify authentication:", error);
    throw new Error("Failed to authenticate with Spotify");
  }
}

async function getGoogleToken(urlParams) {
  let googleData = {};
  const authOptions = {
    url: "https://oauth2.googleapis.com/token",
    data: new URLSearchParams({
      code: urlParams.code,
      client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_APP_GOOGLE_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      scope: "openid profile email",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const responseToken = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });

    googleData.tokenInfo = responseToken.data;

    // Devolver una nueva promesa para esperar la solicitud GET
    return new Promise((resolve, reject) => {
      axios
        .get("https://openidconnect.googleapis.com/v1/userinfo", {
          headers: {
            Authorization: `Bearer ${responseToken.data.access_token}`,
          },
        })
        .then((response) => {
          googleData.userInfo = response.data;
          googleData.userInfo.display_name = googleData.userInfo.given_name;
          googleData.userInfo.surnames = googleData.userInfo.family_name;
          googleData.userInfo.loginWith = "google";
          resolve(googleData);
        })
        .catch((error) => {
          console.error("Error making request to Google API:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    throw new Error("Failed to authenticate with Google");
  }
}

async function register(userData) {
  try {
    const response = await axios.post(`${url_api}/register`, {
      email: userData.email,
      name: userData.name,
      surnames: userData.surnames,
      nickname: userData.nickname,
      password: userData.password,
      birthdate: userData.birthdate,
      password_confirmation: userData.password_confirmation,
      // private: userData.private,
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

async function login(userData) {
  try {
    const response = await axios.post(`${url_api}/login`, {
      email: userData.email,
      password: userData.password,
    });

    return response;
  } catch (error) {
    return error.response;
  }
}

async function logout() {
  const store = useStores();
  try {
    await axios.post(`${url_api}/logout`, null, {
      headers: {
        Authorization: `Bearer ${store.getToken()}`,
      },
    });
    store.setLogout();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function completeProfile(userData) {
  try {
    const response = await axios.post(`${url_api}/register`, {
      email: userData.email,
      name: userData.name,
      surnames: userData.surnames,
      nickname: userData.nickname,
      password: userData.password,
      birthdate: userData.birthdate,
      password_confirmation: userData.confirmPassword,
      loginWith: userData.loginWith,
      // private: userData.private,
    });

    return response.data;
  } catch (error) {
    console.error("Error completing profile:", error);
    throw new Error("Failed to complete profile");
  }
}

async function checkEmail(email) {
  try {
    const response = await axios.get(`${url_api}/apps/checkEmail`, {
      params: {
        email: email,
      },
    });

    return response;
  } catch (error) {
    console.error("Error checking email:", error);
    throw new Error("Failed to check email");
  }
}

const authManager = {
  getSpotifyToken,
  getGoogleToken,
  register,
  completeProfile,
  login,
  logout,
  checkEmail,
};

export default authManager;
