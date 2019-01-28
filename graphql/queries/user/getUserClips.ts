import { gql } from "apollo-boost";

export const getUserClips = gql`
  query getUserClips($filters: user_bool_exp, $offset: Int!, $limit: Int!) {
    user(where: { _and: [$filters] }) {
      id
      image
      username
      userId
      userclipsByuserid_aggregate {
        aggregate {
          count
        }
      }
      userclipsByuserid(limit: $limit, offset: $offset) {
        id
        title
        thumbNail
        createdAt
        url
        map
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
      userratingsByuserid_aggregate {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
    }
  }
`;
