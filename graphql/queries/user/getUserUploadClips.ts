import { gql } from "apollo-boost";

export const getUserUploads = gql`
  query getUserUploads(
    $userId: String!
    $filters: clip_bool_exp
    $orderBy: [clip_order_by!]
    $limit: Int!
    $offset: Int!
  ) {
    clip(
      where: { _and: [$filters] }
      order_by: $orderBy
      limit: $limit
      offset: $offset
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
      platform
      type
      players {
        player {
          id
          nickName
          image
          teamId
        }
      }
      events {
        eventId
        event {
          id
          image
          name
        }
      }
      ratings_aggregate {
        aggregate {
          avg {
            rating
          }
        }
      }
    }
    rating_aggregate(where: { clipByclipid: { userId: { _eq: $userId } } }) {
      aggregate {
        count
        sum {
          rating
        }
        avg {
          rating
        }
      }
    }
    clip_aggregate(where: { userId: { _eq: $userId } }) {
      aggregate {
        count
      }
    }
  }
`;
