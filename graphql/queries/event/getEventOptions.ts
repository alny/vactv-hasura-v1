import gql from "graphql-tag";

export const GET_EVENT_OPTIONS = gql`
  query getEventOptions {
    eventOptions: event(order_by: { createdAt: desc }, limit: 8) {
      id
      name
    }
  }
`;

export const FRONT_PAGE = gql`
  query frontPageData {
    eventClips: event(
      limit: 1
      where: { isActive: { _eq: true } }
      order_by: { createdAt: desc }
    ) {
      id
      name
      eventClips_aggregate {
        aggregate {
          count
        }
      }
      eventClips(limit: 4) {
        clip {
          id
          title
          thumbNail
          url
          map
          category
          userId
          weapon
          players {
            player {
              id
              nickName
              image
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
    topPlayers: playerOnClip(
      limit: 4
      order_by: {
        player: {
          rating_aggregate: {
            avg: { rating: desc_nulls_last }
            count: desc_nulls_last
          }
        }
      }
    ) {
      player {
        id
        image
        nickName
        playerClips_aggregate {
          aggregate {
            count
          }
        }
        team {
          id
          name
          image
        }
        rating_aggregate {
          aggregate {
            count
            avg {
              rating
            }
          }
        }
      }
    }
  }
`;
