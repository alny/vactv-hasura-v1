import { gql } from "apollo-boost";

export const getUserClips = gql`
  query getUserClips(
    $userId: String!
    $filters: user_bool_exp
    $offset: Int!
    $limit: Int!
  ) {
    user(where: { _and: [$filters] }) {
      id
      image
      username
      userId
      clipsByuserid_aggregate(where: { type: { _eq: "user" } }) {
        aggregate {
          count
        }
      }
      ratings_aggregate(
        where: {
          clipByclipid: { type: { _eq: "user" }, userId: { _eq: $userId } }
        }
      ) {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
      clipsByuserid(
        where: { type: { _eq: "user" } }
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
