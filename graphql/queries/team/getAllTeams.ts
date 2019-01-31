import { gql } from "apollo-boost";

export const getAllTeams = gql`
  query getAllTeams(
    $filters: team_bool_exp
    $orderBy: [team_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    team(
      where: { _and: [$filters] }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      image
      name
      ratings_aggregate {
        aggregate {
          avg {
            rating
          }
        }
      }
    }
  }
`;
