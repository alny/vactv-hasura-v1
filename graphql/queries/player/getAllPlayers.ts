import { gql } from "apollo-boost";

export const getAllPlayers = gql`
  query getAllPlayers(
    $filters: player_bool_exp
    $orderBy: [player_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    player(
      where: { _and: [$filters] }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      image
      name
      nickName
      team {
        id
        name
        image
      }
      rating_aggregate {
        aggregate {
          avg {
            rating
          }
        }
      }
      playerClips_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
