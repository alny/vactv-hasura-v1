export const backdropStyle = {
  position: "fixed",
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#000",
  opacity: 0.5
};

export const modalStyle = function() {
  return {
    zIndex: 1040,
    position: "absolute",
    width: "50%",
    height: "50%",
    top: "-25%",
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto"
  };
};

export const circleStyle = rating => {
  return {
    root: {},
    // Customize the path, i.e. the part that's "complete"
    path: {
      // Tweak path color:
      stroke: colorPicker(rating),
      // Tweak path to use flat or rounded ends:
      strokeLinecap: "rounded",
      // Tweak transition animation:
      transition: "stroke-dashoffset 0.5s ease 0s"
    },
    // Customize the circle behind the path
    trail: {
      // Tweak the trail color:
      stroke: "#d6d6d6"
    },
    // Customize the text
    text: {
      // Tweak text color:
      fill: colorPicker(rating),
      // Tweak text size:
      fontSize: "34px"
    }
  };
};

export const colorPicker = rating => {
  if (1 <= rating && rating < 2) {
    return "#fb646f";
  }
  if (2 <= rating && rating < 3) {
    return "#fb646f";
  }
  if (3 <= rating && rating < 4) {
    return "#fb8064";
  }
  if (4 <= rating && rating < 5) {
    return "#cc9334";
  }
  if (5 <= rating && rating < 6) {
    return "#cc9334";
  }
  if (6 <= rating && rating < 7) {
    return "#bdbc60";
  }
  if (7 <= rating && rating < 8) {
    return "#6bb758";
  }
  if (8 <= rating && rating < 9) {
    return "#28a745";
  }
  if (9 <= rating && rating < 11) {
    return "#28a745";
  }
};

export const emojiRating = rating => {
  if (1 <= rating && rating < 2) {
    return `😞`;
  }
  if (2 <= rating && rating < 3) {
    return `😑`;
  }
  if (3 <= rating && rating < 4) {
    return `🤔`;
  }
  if (4 <= rating && rating < 5) {
    return `🙂`;
  }
  if (5 <= rating && rating < 6) {
    return `😊`;
  }
  if (6 <= rating && rating < 7) {
    return `😄`;
  }
  if (7 <= rating && rating < 8) {
    return `😆`;
  }
  if (8 <= rating && rating < 9) {
    return `😲`;
  }
  if (9 <= rating && rating < 19) {
    return `🤩`;
  }
};

export const toFixed = number => {
  if (number > 0) {
    return number.toFixed(1);
  }
  return 0;
};

export const medalStylePicker = number => {
  if (number === 0) {
    return "goldMedal";
  }
  if (number === 1) {
    return "silverMedal";
  }
  if (number === 2) {
    return "bronzeMedal";
  }
};

export const medalPicker = number => {
  if (number === 0) {
    return `🥇`;
  }
  if (number === 1) {
    return `🥈`;
  }
  if (number === 2) {
    return `🥉`;
  }
};
