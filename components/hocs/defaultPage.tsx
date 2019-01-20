import React from "react";
import { getTokenForBrowser, getTokenForServer } from "../Auth/auth";

type IProps = {};

export default Page =>
  class BaseComponent extends React.Component<IProps> {
    static async getInitialProps({ req, query }) {
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
      console.log(this.props);
    }

    render() {
      return <Page {...this.props} />;
    }
  };
