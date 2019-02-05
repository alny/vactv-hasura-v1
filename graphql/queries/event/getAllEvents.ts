import { gql } from "apollo-boost";

export const getAllEvents = gql`
  query getAllEvents(
    $filters: event_bool_exp
    $orderBy: [event_order_by!]
    $offset: Int!
    $limit: Int!
  ) {
    event(
      where: { _and: [$filters] }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      image
      name
      organizer
      year
      type
      nameSlug
      rating_aggregate {
        aggregate {
          avg {
            rating
          }
        }
      }
      eventClips_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
