import * as yup from "yup";

export const createClipSchema = yup.object().shape({
  url: yup
    .string()
    // .matches(/^[a-zA-Z0-9]*$/, "username can only contain letters and numbers")
    .min(3)
    .required(),
  event: yup.string().required(),
  weapon: yup.string().required(),
  category: yup.string().required(),
  map: yup.string().required(),
  player: yup.string().required()
});
