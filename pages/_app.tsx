import App, { Container } from "next/app";
import React from "react";
import Router from "next/router";
import { ApolloProvider } from "react-apollo";
import NProgress from "nprogress";
import withApolloClient from "../lib/with-apollo-client";

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
        <ApolloProvider client={apolloClient}>
          <Component {...propsWithClient} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(NextApp);
