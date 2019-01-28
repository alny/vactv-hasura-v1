import {
  createUserClipSchema,
  createProClipSchema
} from "../../utils/Yup/Schemas";

import {
  CREATE_PRO_CLIP_MUTATION,
  CREATE_USER_CLIP_MUTATION
} from "../../graphql/mutations/clips/createClipMutation";

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
    title
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
      map
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
      map
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
  return choose;
};
