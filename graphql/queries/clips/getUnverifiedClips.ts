import { gql } from "apollo-boost";

export const getNotPublishedClips = gql`
  query getNotPublishedClips {
    clip(where: { isPublic: { _eq: false } }) {
      id
      title
      thumbNail
      createdAt
      url
      isPublic
      map
      userId
      category
      weapon
      player {
        id
        nickName
        name
        image
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
  }
`;
