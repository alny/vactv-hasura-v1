import gql from "graphql-tag";

export const CREATE_OTHER_CLIP_MUTATION = gql`
  mutation insert_otherClip($objects: [otherClip_insert_input!]!) {
    insert_otherClip(objects: $objects) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
