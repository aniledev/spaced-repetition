/* eslint-disable import/no-anonymous-default-export */
export default {
  API_ENDPOINT:
    process.env.REACT_APP_PORT_URL ||
    "http://stormy-meadow-18456.herokuapp.com/api",
  TOKEN_KEY: "blogful-client-auth-token",
};
