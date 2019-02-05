import { gql } from "apollo-boost";

export const getNotPublishedClips = gql`
  query getNotPublishedClips {
    clip(where: { isPublic: { _eq: false }, type: { _eq: "pro" } }) {
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
  }
`;
