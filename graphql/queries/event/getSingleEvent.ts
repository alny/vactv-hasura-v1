import { gql } from "apollo-boost";

export const getSingleEventClips = gql`
  query getSingleEventClips(
    $filters: event_bool_exp
    $orderBy: [eventOnClip_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    event(where: { _and: [$filters] }) {
      id
      image
      name
      eventClips_aggregate {
        aggregate {
          count
        }
      }
      eventClips(
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
          isPublic
          category
          weapon
          players {
            player {
              id
              image
              name
              nickName
              teamId
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
