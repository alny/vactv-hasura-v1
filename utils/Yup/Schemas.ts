import * as yup from "yup";

export const testerSchema = data => {
  console.log("TCL: data", data);
  let objData: any = {
    url: yup
      .string()
      .matches(/(youtube.com|twitch.tv|plays.tv|twitter.com)/, {
        excludeEmptyString: true
      })
      .min(10)
      .required(),
    category: yup.string().required(),
    clipType: yup.string().required()
  };
  const {
    player,
    event,
    weapon,
    map,
    clipType,
    platform,
    category,
    isChecked
  } = data;

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
    // if (isChecked && category === "team") {
    //   objData = {
    //     team: yup.string().required(),
    //     platform: yup.string().required(),
    //     ...objData
    //   };
    // } else {
    //   objData = {
    //     team: yup.string().required(),
    //     // event: yup.string().required(),
    //     ...objData
    //   };
    // }
  }

  return yup.object().shape(objData);
};
