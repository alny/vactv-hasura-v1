import * as yup from "yup";

export const createProClipSchema = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube|twitch|plays)/, { excludeEmptyString: true })
    .min(10)
    .required(),
  event: yup.string().nullable(true),
  weapon: yup.string().required(),
  category: yup.string().required(),
  map: yup.string().required(),
  clipType: yup.string().required(),
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

export const createOtherClipSchema = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube|twitch|plays)/, { excludeEmptyString: true })
    .min(10)
    .required(),
  event: yup.string(),
  weapon: yup.string(),
  map: yup.string(),
  clipType: yup.string().required(),
  otherType: yup.string().required(),
  player: yup.string()
});
