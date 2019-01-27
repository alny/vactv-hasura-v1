import React, { Component } from "react";
import { parseHash } from "../components/Auth/auth0";
import { verifyToken, saveToken } from "../components/Auth/auth";
import { gql } from "apollo-boost";
import Layout from "../components/Layout";

interface Props {
  user: any;
  client: any;
}

const getOneUser = gql`
  query getOneUser($userId: String!) {
    user(where: { userId: { _eq: $userId } }) {
      userId
    }
  }
`;

class Callback extends Component<Props> {
  async componentDidMount() {
    await parseHash(async (err, result) => {
      if (err) {
        console.error("Error signing in", err);
        return;
      }
      if (result != null) {
        verifyToken(result.idToken).then(async valid => {
          if (valid) {
            let user = {
              id: result.idTokenPayload.sub,
              name: result.idTokenPayload.name,
              image: result.idTokenPayload.picture,
              nickName: result.idTokenPayload.nickname
            };
            localStorage.setItem("user", JSON.stringify(user));
            let foundUser = await this.props.client.query({
              query: getOneUser,
              variables: { userId: result.idTokenPayload.sub }
            });
            if (foundUser.data.user.length === 0) {
              await this.props.client.mutate({
                mutation: gql`
                  mutation($userId: String!, $username: String) {
                    insert_user(
                      objects: [{ userId: $userId, username: $username }]
                    ) {
                      affected_rows
                    }
                  }
                `,
                variables: {
                  userId: result.idTokenPayload.sub,
                  username: result.idTokenPayload.nickname
                }
              });
            }
            saveToken(result.idToken, result.accessToken);
            window.location.replace("/");
          } else {
            window.location.replace("/");
          }
        });
      } else {
        window.location.replace("/");
      }
    });
  }

  render() {
    return (
      <Layout title="Vac.Tv | Loading" isLoggedIn={false}>
        <main>
          <div className="freelancers sidebar">
            <div style={{ width: "11%", margin: "auto" }} className="container">
              <div className="loader" />
            </div>
          </div>
        </main>
      </Layout>
    );
  }
}

export default Callback;
