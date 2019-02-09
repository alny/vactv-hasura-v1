import { gql } from "apollo-boost";

export const searchTeam = gql`
  query searchTeam($filters: team_bool_exp) {
    team(where: { _and: [$filters] }) {
      id
      name
    }
  }
`;
