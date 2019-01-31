import gql from "graphql-tag";

export const GET_FRONTPAGE_EVENTS = gql`
  query findLatestEvent {
    eventClips: event(
      where: { isActive: { _eq: true } }
      order_by: { createdAt: desc }
      limit: 1
    ) {
      id
      name
      clips_aggregate(where: { isPublic: { _eq: true } }) {
        aggregate {
          count
        }
      }
      clips(
        where: { isPublic: { _eq: true } }
        order_by: {
          ratings_aggregate: { avg: { rating: desc_nulls_last } }
          id: desc
        }
        limit: 4
      ) {
        id
        title
        thumbNail
        url
        map
        category
        userId
        weapon
        eventId
        player {
          id
          nickName
          image
          teamId
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
      name
      image
      nickName
      clips {
        event {
          isActive
        }
      }
      team {
        id
        name
        image
      }
      clips_aggregate(where: { isPublic: { _eq: true } }) {
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
    }
  }
`;

export const GET_EVENT_OPTIONS = gql`
  query getEventOptions {
    eventOptions: event(order_by: { createdAt: desc }, limit: 8) {
      id
      name
    }
  }
`;
