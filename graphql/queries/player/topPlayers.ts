import { gql } from "apollo-boost";

export const fetchTopPlayers = gql`
  query getTopPlayers(
    $filters: player_bool_exp
    $orderBy: [player_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    player(
      where: { _and: [$filters] }
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
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
