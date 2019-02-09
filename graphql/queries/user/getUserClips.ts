import { gql } from "apollo-boost";

export const getUserClips = gql`
  query getUserClips($filters: user_bool_exp, $offset: Int!, $limit: Int!) {
    user(where: { _and: [$filters] }) {
      id
      image
      username
      userId
      clipsByuserid_aggregate {
        aggregate {
          count
        }
      }
      ratings_aggregate {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
      clipsByuserid(limit: $limit, offset: $offset) {
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
