import { gql } from "apollo-boost";

export const searchPlayer = gql`
  query searchPlayer($filters: player_bool_exp) {
    player(where: { _and: [$filters] }) {
      id
      nickName
    }
  }
`;
