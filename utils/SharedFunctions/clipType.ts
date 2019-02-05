import { createProClipSchema } from "../../utils/Yup/Schemas";

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
    otherType
  } = state;

  let choose: any = {};

  choose.validator = createProClipSchema;
  choose.validateData = {
    url,
    weapon,
    category,
    map,
    clipType,
    platform
  };
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
