import { gql } from "apollo-boost";

export const getTeamWithPlayers = gql`
  query getTeamWithPlayers($teamId: uuid!) {
    clip(where: { player: { team: { id: { _eq: $teamId } } } }, limit: 12) {
      id
      title
      thumbNail
      createdAt
      url
      map
      userId
      category
      weapon
      player {
        id
        image
        name
        nickName
      }
      event {
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
    team(where: { id: { _eq: $teamId } }) {
      id
      image
      name
      players(
        order_by: { rating_aggregate: { avg: { rating: desc_nulls_last } } }
      ) {
        id
        image
        name
        nickName
        rating_aggregate {
          aggregate {
            avg {
              rating
            }
          }
        }
      }
    }
  }
`;
