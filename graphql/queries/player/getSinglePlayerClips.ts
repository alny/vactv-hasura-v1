import { gql } from "apollo-boost";

export const getSinglePlayerClips = gql`
  query getSinglePlayerClips(
    $playerId: uuid!
    $orderBy: [playerOnClip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    player(where: { id: { _eq: $playerId } }) {
      id
      image
      name
      nickName
      team {
        id
        image
        name
      }
      playerClips_aggregate {
        aggregate {
          count
        }
      }
      rating_aggregate {
        aggregate {
          count
          avg {
            rating
          }
        }
      }
      playerClips(
        order_by: $orderBy
        offset: $offset
        limit: $limit
        where: { clip: { isPublic: { _eq: true } } }
      ) {
        clip {
          id
          title
          thumbNail
          createdAt
          url
          map
          userId
          category
          weapon
          type
          platform
          events {
            event {
              id
              name
              image
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
    }
  }
`;
