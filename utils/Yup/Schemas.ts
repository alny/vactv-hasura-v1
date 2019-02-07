import * as yup from "yup";

export const createProClipSchema = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube.com|twitch.tv|plays.tv|twitter.com)/, {
      excludeEmptyString: true
    })
    .min(10)
    .required(),
  player: yup.string().required(),
  weapon: yup.string().required(),
  category: yup.string().required(),
  platform: yup.string(),
  map: yup.string().required(),
  clipType: yup.string().required()
});

export const createUserClipSchema = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube.com|twitch.tv|plays.tv|twitter.com)/, {
      excludeEmptyString: true
    })
    .min(10)
    .required(),
  weapon: yup.string().required(),
  category: yup.string().required(),
  map: yup.string().required(),
  platform: yup.string().required(),
  clipType: yup.string().required()
});

export const fragmovieHighLight = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube.com|twitch.tv|plays.tv|twitter.com)/, {
      excludeEmptyString: true
    })
    .min(10)
    .required(),
  event: yup.string(),
  category: yup.string().required(),
  clipType: yup.string().required(),
  player: yup.string()
});

export const tutorial = yup.object().shape({
  url: yup
    .string()
    .matches(/(youtube.com|twitch.tv|plays.tv|twitter.com)/, {
      excludeEmptyString: true
    })
    .min(10)
    .required(),
  event: yup.string(),
  weapon: yup.string(),
  map: yup.string().required(),
  category: yup.string().required(),
  clipType: yup.string().required(),
  player: yup.string()
});
