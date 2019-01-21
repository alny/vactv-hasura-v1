import React from "react";
import { getTokenForBrowser, getTokenForServer } from "../Auth/auth";
import Router from "next/router";

type IProps = {
  isLoggedIn: boolean;
  role: string;
};

export default Page =>
  class BaseComponent extends React.Component<IProps> {
    static async getInitialProps({ req }) {
      const loggedInUser = (process as any).browser
        ? await getTokenForBrowser()
        : await getTokenForServer(req);

      const role = loggedInUser
        ? loggedInUser["https://vac.tv/roles"]["x-hasura-role"]
        : "";
      const pageProperties =
        (await Page.getInitialProps) && (await Page.getInitialProps(req));
      return {
        ...pageProperties,
        loggedInUser,
        role,
        isLoggedIn: !!loggedInUser
      };
    }
    componentDidMount() {
      const { isLoggedIn, role } = this.props;
      console.log(role);
      if (!isLoggedIn) {
        Router.push("/");
        return;
      }
      if (role === "user") {
        Router.push("/");
        return;
      }
    }

    render() {
      const { isLoggedIn, role } = this.props;
      if (!isLoggedIn) {
        return null;
      }
      if (role === "moderator" || role === "admin") {
        return <Page {...this.props} />;
      }
      return null;
    }
  };
