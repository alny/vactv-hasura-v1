import { gql } from "apollo-boost";

export const getUserClips = gql`
  query getUserClips(
    $userId: user_bool_exp!
    $filters: userClip_bool_exp
    $orderBy: [userClip_order_by!]
    $limit: Int!
    $offset: Int!
  ) {
    user(where: { _and: [$userId] }) {
      id
      image
      username
      userclipsByuserid_aggregate {
        aggregate {
          count
        }
      }
      userratingsByuserid_aggregate {
        aggregate {
          avg {
            rating
          }
        }
      }
    }
    userClip(
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
      type
      userId
      category
      weapon
      ratings_aggregate {
        aggregate {
          avg {
            rating
          }
          count
        }
      }
    }
    userClip_aggregate(where: { _and: [$filters] }) {
      aggregate {
        count
      }
    }
  }
`;
