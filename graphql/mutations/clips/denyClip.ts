import gql from "graphql-tag";

export const DENY_CLIP = gql`
  mutation denyClip($id: uuid!) {
    delete_clip(where: { id: { _eq: $id }, isPublic: { _eq: false } }) {
      affected_rows
    }
  }
`;
