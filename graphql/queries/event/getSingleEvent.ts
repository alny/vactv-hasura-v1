import { gql } from "apollo-boost";

export const getSingleEventClips = gql`
  query getSingleEventClips(
    $filters: event_bool_exp
    $orderBy: [clip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    event(where: { _and: [$filters] }) {
      id
      image
      name
      clips_aggregate {
        aggregate {
          count
        }
      }
      clips(order_by: $orderBy, offset: $offset, limit: $limit) {
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
