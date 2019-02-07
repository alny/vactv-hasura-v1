export const rateObjects = (clip, rating, isLoggedIn, userId) => {
  console.log(rating);
  let rateObj: any = { clipId: clip.id };
  if (clip.players[0] != undefined) {
    rateObj = { playerId: clip.players[0].player.id, ...rateObj };
  }
  if (rating) {
    rateObj = { rating: rating, ...rateObj };
  }
  if (isLoggedIn) {
    rateObj = { userId: !isLoggedIn ? null : userId, ...rateObj };
  }
  if (clip.players[0] != undefined) {
    rateObj = { teamId: clip.players[0].player.teamId, ...rateObj };
  }
  if (clip.events[0] != undefined) {
    rateObj = {
      eventId: !clip.events[0].event
        ? clip.events[0].eventId
        : clip.events[0].event.id,
      ...rateObj
    };
  }
  return rateObj;
};
