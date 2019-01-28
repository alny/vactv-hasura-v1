import gql from "graphql-tag";

export const CREATE_PRO_CLIP_MUTATION = gql`
  mutation insert_clip($objects: [clip_insert_input!]!) {
    insert_clip(objects: $objects) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const CREATE_USER_CLIP_MUTATION = gql`
  mutation insert_userClip($objects: [userClip_insert_input!]!) {
    insert_userClip(objects: $objects) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
