import gql from "graphql-tag";

export const CREATE_CLIP_MUTATION = gql`
  mutation insert_clip($objects: [clip_insert_input!]!) {
    insert_clip(objects: $objects) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
