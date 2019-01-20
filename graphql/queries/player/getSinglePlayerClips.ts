import { gql } from "apollo-boost";

export const getSinglePlayerClips = gql`
  query getSinglePlayerClips(
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
      clips_aggregate(where: { isPublic: { _eq: true } }) {
        aggregate {
          count
        }
      }
      rating_aggregate {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
      clips(
        order_by: $orderBy
        offset: $offset
        limit: $limit
        where: { isPublic: { _eq: true } }
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
    }
  }
`;
