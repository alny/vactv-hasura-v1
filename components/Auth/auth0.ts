import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";

function webAuth(clientID, domain) {
  return new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: "id_token",
    scope: "openid profile"
  });
}

function login() {
  const options = {
    responseType: "id_token",
    redirectUri: AUTH_CONFIG.callbackUrl,
    scope: "openid profile email"
  };

  return webAuth(AUTH_CONFIG.clientId, AUTH_CONFIG.domain).authorize(options);
}

function parseHash(cb) {
  return webAuth(AUTH_CONFIG.clientId, AUTH_CONFIG.domain).parseHash(cb);
}

function logout() {
  return webAuth(AUTH_CONFIG.clientId, AUTH_CONFIG.domain).logout();
}

export { login, parseHash, logout };
