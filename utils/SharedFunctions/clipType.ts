import {
  createUserClipSchema,
  createProClipSchema,
  createOtherClipSchema
} from "../../utils/Yup/Schemas";

import {
  CREATE_PRO_CLIP_MUTATION,
  CREATE_USER_CLIP_MUTATION
} from "../../graphql/mutations/clips/createClipMutation";
import { CREATE_OTHER_CLIP_MUTATION } from "../../graphql/mutations/clips/createOtherClip";

export const clipTypeGen = (state, props) => {
  const {
    url,
    player,
    event,
    weapon,
    category,
    map,
    platform,
    clipType,
    title,
    otherType
  } = state;

  let choose: any = {};

  if (clipType === "Pro Clip") {
    choose.validator = createProClipSchema;
    choose.validateData = {
      url,
      player,
      event,
      weapon,
      category,
      map,
      clipType
    };
    choose.mutation = CREATE_PRO_CLIP_MUTATION;
    choose.variables = {
      url,
      title,
      playerId: player,
      eventId: event,
      userId: props.loggedInUser.sub,
      weapon,
      category,
      map,
      type: platform
    };
  }
  if (clipType === "User Clip") {
    choose.validator = createUserClipSchema;
    choose.validateData = {
      url,
      weapon,
      category,
      map,
      platform
    };
    choose.mutation = CREATE_USER_CLIP_MUTATION;
    choose.variables = {
      url,
      title,
      userId: props.loggedInUser.sub,
      weapon,
      category,
      map,
      type: platform
    };
  }
  if (
    clipType === "Tutorial" ||
    clipType === "Highlight" ||
    clipType === "Fragmovie"
  ) {
    choose.validator = createOtherClipSchema;
    choose.validateData = {
      url,
      weapon,
      category,
      player,
      map,
      clipType,
      otherType
    };
    choose.mutation = CREATE_OTHER_CLIP_MUTATION;
    choose.variables = {
      url,
      title,
      userId: props.loggedInUser.sub,
      weapon,
      category: otherType,
      map,
      type: clipType
    };
  }
  return choose;
};
