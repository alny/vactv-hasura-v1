import { gql } from "apollo-boost";

export const getSingleClip = gql`
  query getSingleClip($clipId: uuid!) {
    clip(where: { id: { _eq: $clipId } }) {
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
      players {
        player {
          id
          nickName
          name
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
