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
      eventId
      player {
        id
        nickName
        name
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
  }
`;
