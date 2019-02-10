import gql from "graphql-tag";

export const RATE_CLIP_MUTATION = gql`
  mutation rateClip(
    $userId: String!
    $rating: Int!
    $objects: [rating_insert_input!]!
  ) {
    insert_rating(objects: $objects) {
      affected_rows
    }
    update_user(
      where: { userId: { _eq: $userId } }
      _inc: { credits: $rating }
    ) {
      affected_rows
    }
  }
`;
