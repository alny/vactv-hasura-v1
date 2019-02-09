import * as React from "react";
import {
  emojiRating,
  toFixed,
  circleStyle,
  modalStyle
} from "../../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
//@ts-ignore
import { Link } from "../../server/routes";
import { Mutation } from "react-apollo";
import { RATE_CLIP_MUTATION } from "../../graphql/mutations/clips/rateClipMutation";
import Select from "react-select";
import { rateOptions } from "../../utils/Options";
import { submitRate } from "../../utils/SharedFunctions/submitRating";
import { rateObjects } from "../../utils/SharedFunctions/rateClips";

const ClipCard: React.SFC<any> = ({
  specificStyle,
  props,
  isLoggedIn,
  clip,
  rating,
  onClick,
  handleChange,
  showModal,
  closeModal,
  renderBackdrop
}) => {
  return (
    <div className={specificStyle}>
      <div className="inside">
        <a onClick={onClick} href="#">
          <img className="card-img-top" src={clip.thumbNail} alt={clip.url} />
        </a>
        <a onClick={onClick} href="#" className="play" />
        <div className="middle">
          <div>
            <h3 style={{ textTransform: "capitalize" }}>
              <Link route="clip" id={clip.id}>
                <a>
                  {clip.category}{" "}
                  {emojiRating(clip.ratings_aggregate.aggregate.avg.rating)}
                </a>
              </Link>
            </h3>

            <h6
              style={{
                textTransform: "capitalize",
                fontSize: "12px"
              }}
            >
              {clip.map ? "🌍 " + clip.map : "📺 " + clip.type} |
              <span style={{ textTransform: "uppercase" }}>
                {clip.weapon ? (
                  " 💢 " + clip.weapon
                ) : (
                  <span style={{ textTransform: "capitalize" }}>
                    {" 💢 " + clip.category}
                  </span>
                )}
              </span>
            </h6>
          </div>
        </div>
        <div className="bottom">
          {clip.players[0] === undefined ? (
            <img
              src={
                "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
              }
              alt={
                "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
              }
            />
          ) : (
            <Link
              route="player"
              id={
                clip.players[0] === undefined ? "1" : clip.players[0].player.id
              }
            >
              <a>
                <img
                  src={
                    clip.players[0] === undefined
                      ? ""
                      : clip.players[0].player.image
                  }
                  alt={
                    clip.players[0] === undefined
                      ? ""
                      : clip.players[0].player.nickName
                  }
                />
              </a>
            </Link>
          )}
          {clip.players[0] === undefined ? (
            <span>
              {clip.players[0] === undefined ? (
                <span style={{ textTransform: "capitalize" }}>
                  {clip.type === "user" ? clip.platform : clip.type}
                </span>
              ) : (
                clip.players[0].player.nickName
              )}
            </span>
          ) : (
            <Link
              route="player"
              id={
                clip.players[0] === undefined ? "" : clip.players[0].player.id
              }
            >
              <a>
                <span>
                  {clip.players[0] === undefined ? (
                    <span style={{ textTransform: "capitalize" }}>
                      {clip.type === "user" ? clip.platform : clip.type}
                    </span>
                  ) : (
                    clip.players[0].player.nickName
                  )}
                </span>
              </a>
            </Link>
          )}

          <div
            style={{
              width: "32px",
              display: "inline-block",
              float: "right"
            }}
          >
            <CircularProgressbar
              percentage={
                toFixed(clip.ratings_aggregate.aggregate.avg.rating) * 10
              }
              text={toFixed(clip.ratings_aggregate.aggregate.avg.rating)}
              styles={circleStyle(clip.ratings_aggregate.aggregate.avg.rating)}
            />
          </div>
        </div>
      </div>
      <Mutation
        mutation={RATE_CLIP_MUTATION}
        variables={{
          objects: [
            rateObjects(
              clip,
              rating,
              !props.loggedInUser ? null : props.loggedInUser,
              !props.loggedInUser ? null : props.loggedInUser.sub
            )
          ]
        }}
      >
        {(rateClip, {}) => (
          <Modal
            onHide={closeModal}
            style={modalStyle()}
            aria-labelledby="modal-label"
            show={showModal}
            renderBackdrop={renderBackdrop}
          >
            <div
              style={{
                paddingBottom: "20px",
                paddingTop: "20px",
                backgroundColor: "#fafafa",
                borderRadius: "5px"
              }}
            >
              <div>
                <h4
                  style={{
                    marginLeft: "15px",
                    marginBottom: "18px",
                    textTransform: "capitalize",
                    fontSize: "16px"
                  }}
                >
                  🎬{" "}
                  {clip.category + " on " + clip.map + " with a " + clip.weapon}
                </h4>
              </div>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  className="embed-responsive-item"
                  frameBorder="false"
                  src={clip.url}
                />
              </div>
              <div
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  height: "28px"
                }}
              >
                <Link
                  route="player"
                  id={
                    clip.players[0] === undefined
                      ? ""
                      : clip.players[0].player.id
                  }
                >
                  <a>
                    <img
                      className="modalPlayerImg"
                      src={
                        clip.players[0] === undefined
                          ? ""
                          : clip.players[0].player.image
                      }
                      alt={
                        clip.players[0] === undefined
                          ? ""
                          : clip.players[0].player.nickName
                      }
                    />
                    <span className="modalPlayerImgText">
                      {clip.players[0] === undefined
                        ? ""
                        : clip.players[0].player.nickName}
                    </span>
                  </a>
                </Link>
                {!isLoggedIn ? (
                  <div
                    style={{
                      width: "32px",
                      display: "inline-block",
                      float: "right"
                    }}
                  >
                    <CircularProgressbar
                      percentage={
                        toFixed(clip.ratings_aggregate.aggregate.avg.rating) *
                        10
                      }
                      text={toFixed(
                        clip.ratings_aggregate.aggregate.avg.rating
                      )}
                      styles={circleStyle(
                        clip.ratings_aggregate.aggregate.avg.rating
                      )}
                    />
                  </div>
                ) : (
                  <Select
                    menuPlacement="top"
                    minMenuHeight={200}
                    //@ts-ignore
                    onChange={handleChange}
                    onMenuClose={() => submitRate(rateClip, rating, closeModal)}
                    className="rateSelector"
                    placeholder="Rate 😆"
                    options={rateOptions}
                  />
                )}
              </div>
            </div>
          </Modal>
        )}
      </Mutation>
    </div>
  );
};

export default ClipCard;
