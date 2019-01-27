import { gql } from "apollo-boost";

export const getClips = gql`
  query getClips {
    eventClips: clip(limit: 4) {
      id
      title
      thumbNail
      url
      map
      category
      userId
      weapon
      player {
        id
        nickName
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
