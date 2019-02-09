import * as yup from "yup";

export const testerSchema = data => {
  console.log("TCL: data", data);
  let objData: any = {
    url: yup
      .string()
      .matches(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        "Invalid URL"
      )
      .min(10, "Min 15 characters long")
      .required("Invalid URL!"),
    category: yup.string().required("Category is required!"),
    clipType: yup.string().required("Type is required!")
  };
  const { clipType, category, isChecked } = data;

  if (clipType === "pro" || clipType === "user") {
    if (isChecked && clipType === "pro") {
      objData = {
        platform: yup.string().required(),
        map: yup.string().required(),
        weapon: yup.string().required(),
        player: yup.string().required(),
        ...objData
      };
    } else if (clipType === "user") {
      objData = {
        platform: yup.string().required(),
        map: yup.string().required(),
        weapon: yup.string().required(),
        ...objData
      };
    } else {
      objData = {
        map: yup.string().required(),
        weapon: yup.string().required(),
        player: yup.string().required(),
        event: yup.string().required(),
        ...objData
      };
    }
  }
  if (clipType === "tutorial") {
    if (
      category === "weapon" ||
      category === "smoke" ||
      category === "flash" ||
      category === "spray control" ||
      category === "aim"
    ) {
      objData = {
        map: yup.string().required(),
        weapon: yup.string().required(),
        ...objData
      };
    } else {
      objData = {
        map: yup.string().required(),
        ...objData
      };
    }
  }
  if (clipType === "highlight" || clipType === "fragmovie") {
    if (isChecked && category === "player") {
      console.log(objData);
      objData = {
        player: yup.string().required(),
        platform: yup.string().required(),
        ...objData
      };
    } else if (isChecked && category === "team") {
      objData = {
        team: yup.string().required(),
        platform: yup.string().required(),
        ...objData
      };
    } else {
      objData = {
        player: yup.string().required(),
        event: yup.string().required(),
        ...objData
      };
    }
  }

  return yup.object().shape(objData);
};
