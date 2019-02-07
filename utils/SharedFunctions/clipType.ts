import {
  createProClipSchema,
  createUserClipSchema,
  tutorial,
  fragmovieHighLight
} from "../../utils/Yup/Schemas";

import { CREATE_PRO_CLIP_MUTATION } from "../../graphql/mutations/clips/createClipMutation";

export const clipTypeGen = (state, props) => {
  const {
    url,
    weapon,
    category,
    map,
    platform,
    clipType,
    title,
    player,
    event,
    otherType
  } = state;

  let choose: any = {};
  if (clipType === "pro") {
    choose.validator = createProClipSchema;
    choose.validateData = {
      url,
      weapon,
      category,
      map,
      player,
      event,
      clipType,
      platform
    };
  }
  if (clipType === "user") {
    choose.validator = createUserClipSchema;
    choose.validateData = {
      url,
      weapon,
      category,
      map,
      clipType,
      platform
    };
  }
  if (
    clipType === "tutorial" ||
    clipType === "highlight" ||
    clipType === "fragmovie"
  ) {
    choose.validator = tutorial;
    choose.validateData = {
      url,
      weapon,
      category,
      map,
      clipType,
      player,
      event
    };
  }
  if (clipType === "highlight" || clipType === "fragmovie") {
    choose.validator = fragmovieHighLight;
    choose.validateData = {
      url,
      category,
      clipType,
      player,
      event
    };
  }

  choose.mutation = CREATE_PRO_CLIP_MUTATION;
  choose.variables = {
    url,
    title,
    userId: props.loggedInUser.sub,
    weapon,
    category,
    map,
    platform,
    type: clipType
  };
  return choose;
};
