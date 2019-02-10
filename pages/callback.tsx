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
      id
      userId
      credits
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
            let foundUser = await this.props.client.query({
              query: getOneUser,
              variables: { userId: result.idTokenPayload.sub }
            });
            let response;
            if (foundUser.data.user.length === 0) {
              response = await this.props.client.mutate({
                mutation: gql`
                  mutation($userId: String!, $username: String) {
                    insert_user(
                      objects: [{ userId: $userId, username: $username }]
                    ) {
                      returning {
                        id
                      }
                    }
                  }
                `,
                variables: {
                  userId: result.idTokenPayload.sub,
                  username: result.idTokenPayload.nickname
                }
              });
            }
            console.log(response);
            console.log(foundUser);

            let user = {
              id: foundUser
                ? foundUser.data.user[0].id
                : response.data.insert_user.returning[0].id,
              name: result.idTokenPayload.name,
              image: result.idTokenPayload.picture,
              credits: foundUser ? foundUser.data.user[0].credits : 0,
              nickName: result.idTokenPayload.nickname
            };
            localStorage.setItem("user", JSON.stringify(user));
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
