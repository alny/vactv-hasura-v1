import React from "react";
import { getTokenForBrowser, getTokenForServer } from "../Auth/auth";
import Router from "next/router";

type IProps = {
  isLoggedIn: boolean;
};

export default Page =>
  class BaseComponent extends React.Component<IProps> {
    static async getInitialProps({ req }) {
      const loggedInUser = (process as any).browser
        ? await getTokenForBrowser()
        : await getTokenForServer(req);

      const pageProperties =
        (await Page.getInitialProps) && (await Page.getInitialProps(req));
      return {
        ...pageProperties,
        loggedInUser,
        isLoggedIn: !!loggedInUser
      };
    }
    componentDidMount() {
      const { isLoggedIn } = this.props;

      if (!isLoggedIn) {
        Router.push("/");
        return;
      }
    }

    render() {
      const { isLoggedIn } = this.props;
      if (!isLoggedIn) {
        return null;
      }
      return <Page {...this.props} />;
    }
  };
