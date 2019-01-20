import gql from "graphql-tag";

export const GET_PLAYER_OPTIONS = gql`
  query findAllPlayers {
    player {
      id
      nickName
    }
  }
`;
