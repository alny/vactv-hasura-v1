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
        order_by: { id: desc }
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
      }
    }
    topPlayers: player(limit: 4) {
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
