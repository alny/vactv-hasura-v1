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

export const CREATE_PLAYER_ON_CLIP_MUTATION = gql`
  mutation insert_playerOnClip($objects: [playerOnClip_insert_input!]!) {
    insert_playerOnClip(objects: $objects) {
      affected_rows
    }
  }
`;

export const CREATE_EVENT_ON_CLIP_MUTATION = gql`
  mutation insert_eventOnClip($objects: [eventOnClip_insert_input!]!) {
    insert_eventOnClip(objects: $objects) {
      affected_rows
    }
  }
`;
