import { gql } from "apollo-boost";

export const getTeamWithPlayers = gql`
  query getTeamWithPlayers(
    $filters: clip_bool_exp
    $teamId: uuid!
    $orderBy: [clip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    clip(
      order_by: $orderBy
      offset: $offset
      limit: $limit
      where: { _and: [$filters] }
    ) {
      id
      title
      thumbNail
      createdAt
      url
      map
      userId
      category
      weapon
      player {
        id
        image
        name
        nickName
      }
      event {
        name
      }
      ratings_aggregate {
        aggregate {
          avg {
            rating
          }
          count
        }
      }
    }
    team(where: { id: { _eq: $teamId } }) {
      id
      image
      name
      players(
        order_by: { rating_aggregate: { avg: { rating: desc_nulls_last } } }
      ) {
        id
        image
        name
        nickName
        rating_aggregate {
          aggregate {
            avg {
              rating
            }
          }
        }
      }
    }
  }
`;
