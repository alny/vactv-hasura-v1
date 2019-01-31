import { gql } from "apollo-boost";

export const getClipsWithPagination = gql`
  query getClipsWithPagination(
    $filters: clip_bool_exp
    $orderBy: [clip_order_by!]
    $limit: Int!
    $cursor: clip_bool_exp
  ) {
    clip(
      where: { _and: [$filters, $cursor] }
      order_by: $orderBy
      limit: $limit
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
      eventId
      player {
        id
        nickName
        image
        teamId
      }
      event {
        id
        image
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
    clip_aggregate(where: { _and: [$filters] }) {
      aggregate {
        count
      }
    }
  }
`;
