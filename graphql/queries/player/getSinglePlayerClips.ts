import { gql } from "apollo-boost";

export const getSinglePlayerClips = gql`
  query getSinglePlayerClips(
    $playerId: uuid!
    $orderBy: [playerOnClip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    player(where: { playerClips: { playerId: { _eq: $playerId } } }) {
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
        playerId
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
