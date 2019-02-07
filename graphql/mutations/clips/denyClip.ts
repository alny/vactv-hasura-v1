import gql from "graphql-tag";

export const DENY_CLIP = gql`
  mutation denyClip($id: uuid!) {
    delete_playerOnClip(where: { clipId: { _eq: $id } }) {
      affected_rows
    }
    delete_eventOnClip(where: { clipId: { _eq: $id } }) {
      affected_rows
    }
    delete_clip(where: { id: { _eq: $id }, isPublic: { _eq: false } }) {
      affected_rows
    }
  }
`;
