import * as React from "react";
import initApollo from "./init-apollo";
import Head from "next/head";
import { getDataFromTree } from "react-apollo";
import cookie from "cookie";
import { isBrowser } from "./isBrowser";

function parseCookies(req?: any, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

export default App => {
  return class Apollo extends React.Component {
    static displayName = "withApolloClient(App)";
    static async getInitialProps(ctx) {
      const {
        Component,
        router,
        ctx: { req, res }
      } = ctx;
      const apolloState = {};
      const apollo = initApollo(
        {},
        {
          getToken: () => parseCookies(req)
        }
      );
      ctx.ctx.apolloClient = apollo;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (res && res.finished) {
        return {};
      }

      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloState={apolloState}
            apolloClient={apollo}
          />
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error);
      }
      if (!isBrowser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      (apolloState as any).data = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    constructor(props) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      (this as any).apolloClient =
        props.apolloClient ||
        initApollo(props.apolloState.data, {
          //@ts-ignore
          getToken: () => parseCookies()
        });
    }

    render() {
      //@ts-ignore
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
