import App, { Container } from "next/app";
import React from "react";
import Router from "next/router";
import { ApolloProvider } from "react-apollo";
import NProgress from "nprogress";
import withApolloClient from "../lib/with-apollo-client";
import ContextProvider from "../lib/context";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = url => {
  NProgress.done();
};
Router.onRouteChangeError = () => NProgress.done();

class NextApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props as any;
    const propsWithClient = {
      ...pageProps,
      client: apolloClient
    };
    return (
      <Container>
        <ContextProvider>
          <ApolloProvider client={apolloClient}>
            <Component {...propsWithClient} />
          </ApolloProvider>
        </ContextProvider>
      </Container>
    );
  }
}

export default withApolloClient(NextApp);
