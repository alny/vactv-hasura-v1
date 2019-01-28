import * as yup from "yup";

export const createProClipSchema = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube|twitch)/, { excludeEmptyString: true })
    .min(10)
    .required(),
  event: yup.string().required(),
  weapon: yup.string().required(),
  category: yup.string().required(),
  map: yup.string().required(),
  player: yup.string().required()
});

export const createUserClipSchema = yup.object().shape({
  url: yup
    .string()
    .min(10)
    .required(),
  weapon: yup.string().required(),
  category: yup.string().required(),
  map: yup.string().required(),
  platform: yup.string().required()
});
