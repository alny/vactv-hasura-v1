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
          platform
          type
          events {
            eventId
          }
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
    topPlayers: player(
      limit: 4
      order_by: {
        rating_aggregate: {
          avg: { rating: desc_nulls_last }
          count: desc_nulls_last
        }
      }
    ) {
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
          avg {
            rating
          }
        }
      }
    }
  }
`;
