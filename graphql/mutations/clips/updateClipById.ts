import gql from "graphql-tag";

export const UPDATE_CLIP_MUTATION = gql`
  mutation updateClip($id: uuid!, $set: clip_set_input) {
    update_clip(where: { id: { _eq: $id } }, _set: $set) {
      affected_rows
    }
  }
`;
