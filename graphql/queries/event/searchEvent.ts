import { gql } from "apollo-boost";

export const searchEvent = gql`
  query searchEvent($filters: event_bool_exp) {
    event(where: { _and: [$filters] }) {
      id
      name
    }
  }
`;
