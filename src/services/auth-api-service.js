import config from "../config";
import TokenService from "./token-service";

const AuthApiService = {
  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  postLogin({ username, password }) {
    return fetch(`${config.API_ENDPOINT}/auth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) =>
      !res.ok ? res.json().then((err) => Promise.reject(err)) : res.json()
    );
  },
  refreshToken() {
    return fetch(`${config.API_ENDPOINT}/auth/token`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );

    // THIS ALTERNATIVE PROMISE HANDLING ALSO PRODUCED THE SAME CONSOLE ERROR

    //   .then((res) =>
    //   !res.ok
    //     ? res.json().then((err) => {
    //         throw new Error(err);
    //       })
    //     : res.json()
    // )
    // .catch((error) => {
    //   throw new Error(error);
    // });
  },
};

export default AuthApiService;
