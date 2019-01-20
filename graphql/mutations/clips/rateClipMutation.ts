import gql from "graphql-tag";

export const RATE_CLIP_MUTATION = gql`
  mutation rateClip($objects: [rating_insert_input!]!) {
    insert_rating(objects: $objects) {
      affected_rows
    }
  }
`;
