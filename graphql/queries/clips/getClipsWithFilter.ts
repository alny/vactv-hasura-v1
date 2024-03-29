import { gql } from "apollo-boost";

export const getClipsWithFilter = gql`
  query getClipsWithFilter(
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
      isPublic
      type
      platform
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
          count
        }
      }
    }
    clip_aggregate(where: { _and: [$filters] }) {
      aggregate {
        count
      }
    }
  }
`;
