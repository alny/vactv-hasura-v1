import { gql } from "apollo-boost";

export const getOtherClipsWithFilter = gql`
  query getOtherClipsWithFilter(
    $filters: otherClip_bool_exp
    $orderBy: [otherClip_order_by!]
    $limit: Int!
    $offset: Int!
  ) {
    otherClip(
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
    otherClip_aggregate(where: { _and: [$filters] }) {
      aggregate {
        count
      }
    }
  }
`;
