import { gql } from "apollo-boost";

export const getTopPlayers = gql`
  query getTopPlayers(
    $filters: player_bool_exp
    $orderBy: [clip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    player(where: { _and: [$filters] }) {
      id
      image
      name
      nickName
      team {
        id
        image
        name
      }
      rating_aggregate {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
    }
  }
`;
