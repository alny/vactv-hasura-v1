import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import { setContext } from "apollo-link-context";
import fetch from "isomorphic-unfetch";

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!(process as any).browser) {
  (global as any).fetch = fetch;
}
// const dev = process.env.NODE_ENV !== "production";

function create(initialState, { getToken }) {
  const httpLink = new HttpLink({
    uri: "https://vactv-server.herokuapp.com/v1alpha1/graphql", // Server URL (must be absolute)
    credentials: "include" // Additional fetch() options like `credentials` or `headers`
  });

  const authLink = setContext((_, { headers }) => {
    const tokenObj = getToken();

    let token;
    if (tokenObj && tokenObj["jwtToken"]) {
      token = tokenObj["jwtToken"];
    } else {
      token = "";
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  const httpLinkWithAuthToken = authLink.concat(httpLink);

  return new ApolloClient({
    connectToDevTools: (process as any).browser,
    ssrMode: !(process as any).browser, // Disables forceFetch on the server (so queries are only run once)
    link: httpLinkWithAuthToken,
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!(process as any).browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
