const dev = process.env.NODE_ENV !== "production";

export const AUTH_CONFIG = {
  domain: dev ? "drixmix.eu.auth0.com" : "vactv.eu.auth0.com",
  clientId: dev
    ? "GeMzhONUu4BFiheds3CwqjGID6vnm8Nh"
    : "urE2ZGI9B2orh5vKNnQYoNspSHSxU1uu",
  callbackUrl: dev
    ? "http://localhost:3000/callback"
    : "https://vactv-web.herokuapp.com/callback"
};
