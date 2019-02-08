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
    choose.validateData = {
      url,
      category,
      clipType,
      player,
      event
    };
  }

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
