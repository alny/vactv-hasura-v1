import gql from "graphql-tag";

export const RATE_CLIP_MUTATION = gql`
  mutation rateClip($objects: [rating_insert_input!]!) {
    insert_rating(objects: $objects) {
      affected_rows
    }
  }
`;

export const RATE_OTHERCLIP_MUTATION = gql`
  mutation rateOtherClip($objects: [otherRating_insert_input!]!) {
    insert_otherRating(objects: $objects) {
      affected_rows
    }
  }
`;

export const RATE_USERCLIP_MUTATION = gql`
  mutation rateUserClip($objects: [userClip_insert_input!]!) {
    insert_userClip(objects: $objects) {
      affected_rows
    }
  }
`;
