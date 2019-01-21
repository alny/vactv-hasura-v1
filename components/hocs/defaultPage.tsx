import React from "react";
import { getTokenForBrowser, getTokenForServer } from "../Auth/auth";

type IProps = {};

export default Page =>
  class BaseComponent extends React.Component<IProps> {
    static async getInitialProps({ req, query }) {
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

    componentDidMount() {}

    render() {
      return <Page {...this.props} />;
    }
  };
