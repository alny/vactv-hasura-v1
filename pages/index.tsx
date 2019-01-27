import * as React from "react";
import Layout from "../components/Layout";
import { Query, Mutation } from "react-apollo";
import defaultPage from "../components/hocs/defaultPage";
import CircularProgressbar from "react-circular-progressbar";
import Select from "react-select";
import { rateOptions } from "../utils/Options";
import { Modal } from "react-overlays";
import {
  modalStyle,
  backdropStyle,
  circleStyle,
  emojiRating,
  toFixed
} from "../utils/Styles";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer } from "react-toastify";
import { GET_FRONTPAGE_EVENTS } from "../graphql/queries/event/getEventOptions";
//@ts-ignore
import { Link } from "../server/routes";
import Links from "next/link";
import { submitRate } from "../utils/SharedFunctions/submitRating";

type Props = {
  isLoggedIn: boolean;
  loggedInUser: any;
  role: String;
};

interface State {
  open: any;
  rating: Number;
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      rating: 0
    };
  }

  onCloseModal = () => {
    this.setState({ open: false });
  };

  onOpenModal(id, event) {
    event.preventDefault();
    this.setState({
      open: {
        [id]: true
      }
    });
  }

  handleChange = name => value => {
    //@ts-ignore
    this.setState({
      [name]: value.value
    });
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { isLoggedIn, role, loggedInUser } = this.props;
    const { rating } = this.state;

    return (
      <Layout
        title="Vac.Tv | Watch & Rate CS:GO Clips"
        role={role}
        isLoggedIn={isLoggedIn}
        loggedInUser={loggedInUser}
      >
        <main
          style={{
            backgroundImage:
              "url(https://s3.eu-central-1.amazonaws.com/vactv/dd2.jpg)",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div style={{ paddingTop: "25px" }} className="freelancers sidebar">
            <Query query={GET_FRONTPAGE_EVENTS}>
              {({ loading, error, data }) => {
                if (loading) return <div className="loader" />;
                if (error) return `Error!: ${error}`;
                if (
                  typeof data.eventClips != "undefined" &&
                  data.eventClips != null &&
                  data.eventClips.length != null &&
                  data.eventClips.length > 0
                ) {
                  return (
                    <div className="container">
                      <div className="above">
                        <Link route="events" id={data.eventClips[0].id}>
                          <a>
                            <h1 style={{ marginBottom: "24px" }}>
                              {data.eventClips[0].name} 🔥
                            </h1>
                          </a>
                        </Link>
                        <div className="buttons">
                          <Link route="events" id={data.eventClips[0].id}>
                            <a>
                              🎬 Event Clips:{" "}
                              {
                                data.eventClips[0].clips_aggregate.aggregate
                                  .count
                              }{" "}
                            </a>
                          </Link>
                        </div>
                      </div>
                      <section>
                        <div className="row">
                          {data.eventClips[0].clips.map(clip => (
                            <div key={clip.id} className="col-md-3">
                              <div className="inside">
                                <a
                                  onClick={this.onOpenModal.bind(this, clip.id)}
                                  href="#"
                                >
                                  <img
                                    className="card-img-top"
                                    src={clip.thumbNail}
                                    alt={clip.url}
                                  />
                                </a>
                                <a
                                  onClick={this.onOpenModal.bind(this, clip.id)}
                                  href="#"
                                  className="play"
                                />
                                <div className="middle">
                                  <div>
                                    <h3 style={{ textTransform: "capitalize" }}>
                                      <Link route="clip" id={clip.id}>
                                        <a>
                                          {clip.category}{" "}
                                          {emojiRating(
                                            clip.ratings_aggregate.aggregate.avg
                                              .rating
                                          )}
                                        </a>
                                      </Link>
                                    </h3>
                                    <h6
                                      style={{
                                        textTransform: "capitalize",
                                        fontSize: "12px"
                                      }}
                                    >
                                      🌍 {clip.map} | 💢{" "}
                                      <span
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {clip.weapon}
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                                <div className="bottom">
                                  <Link route="player" id={clip.player.id}>
                                    <a>
                                      <img
                                        src={
                                          clip.player === null
                                            ? ""
                                            : clip.player.image
                                        }
                                        alt={
                                          clip.player === null
                                            ? ""
                                            : clip.player.nickName
                                        }
                                      />
                                    </a>
                                  </Link>
                                  <Link route="player" id={clip.player.id}>
                                    <a>
                                      <span>
                                        {clip.player === null
                                          ? ""
                                          : clip.player.nickName}
                                      </span>
                                    </a>
                                  </Link>

                                  <div
                                    style={{
                                      width: "32px",
                                      display: "inline-block",
                                      float: "right"
                                    }}
                                  >
                                    <CircularProgressbar
                                      percentage={
                                        toFixed(
                                          clip.ratings_aggregate.aggregate.avg
                                            .rating
                                        ) * 10
                                      }
                                      text={toFixed(
                                        clip.ratings_aggregate.aggregate.avg
                                          .rating
                                      )}
                                      styles={circleStyle(
                                        clip.ratings_aggregate.aggregate.avg
                                          .rating
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                              <Mutation
                                mutation={RATE_CLIP_MUTATION}
                                variables={{
                                  objects: [
                                    {
                                      rating,
                                      userId: !this.props.loggedInUser
                                        ? null
                                        : this.props.loggedInUser.sub,
                                      clipId: clip.id,
                                      playerId: clip.player.id
                                    }
                                  ]
                                }}
                              >
                                {(rateClip, {}) => (
                                  <Modal
                                    onHide={this.onCloseModal}
                                    style={modalStyle()}
                                    aria-labelledby="modal-label"
                                    show={!!this.state.open[clip.id]}
                                    renderBackdrop={this.renderBackdrop}
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
                                          {clip.category +
                                            " on " +
                                            clip.map +
                                            " with a " +
                                            clip.weapon}
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
                                          id={clip.player.id}
                                        >
                                          <a>
                                            <img
                                              className="modalPlayerImg"
                                              src={
                                                clip.player === null
                                                  ? ""
                                                  : clip.player.image
                                              }
                                              alt={
                                                clip.player === null
                                                  ? ""
                                                  : clip.player.nickName
                                              }
                                            />
                                            <span className="modalPlayerImgText">
                                              {clip.player === null
                                                ? ""
                                                : clip.player.nickName}
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
                                                toFixed(
                                                  clip.ratings_aggregate
                                                    .aggregate.avg.rating
                                                ) * 10
                                              }
                                              text={toFixed(
                                                clip.ratings_aggregate.aggregate
                                                  .avg.rating
                                              )}
                                              styles={circleStyle(
                                                clip.ratings_aggregate.aggregate
                                                  .avg.rating
                                              )}
                                            />
                                          </div>
                                        ) : (
                                          <Select
                                            menuPlacement="top"
                                            minMenuHeight={200}
                                            //@ts-ignore
                                            onChange={this.handleChange(
                                              "rating"
                                            )}
                                            onMenuClose={() =>
                                              submitRate(
                                                rateClip,
                                                rating,
                                                this.onCloseModal
                                              )
                                            }
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
                          ))}
                        </div>
                        <div className="above">
                          <Link route="events" id={data.eventClips[0].id}>
                            <a>
                              <h1 style={{ marginBottom: "24px" }}>
                                Top Players 🏅
                              </h1>
                            </a>
                          </Link>
                        </div>
                        <section>
                          <div className="row">
                            {data.topPlayers.map(player => (
                              <div key={player.id} className="col-md-3">
                                <span className="totalPlayerClips">
                                  Clips:{" "}
                                  {player.clips_aggregate.aggregate.count}
                                </span>
                                <div className="inside">
                                  <Link route="player" id={player.id}>
                                    <a>
                                      <img
                                        className="card-img-top"
                                        src={player.image}
                                        alt={player.image}
                                      />
                                    </a>
                                  </Link>

                                  <div className="middle">
                                    <div>
                                      <h3>
                                        <Link route="player" id={player.id}>
                                          <a>{player.nickName}</a>
                                        </Link>
                                      </h3>
                                      <h6
                                        style={{
                                          textTransform: "capitalize",
                                          fontSize: "12px"
                                        }}
                                      >
                                        {player.name}
                                      </h6>
                                    </div>
                                  </div>
                                  <div className="bottom">
                                    <Link route="team" id={player.team.id}>
                                      <a>
                                        <img
                                          src={player.team.image}
                                          alt={player.team.name}
                                        />
                                        <span>{player.team.name}</span>
                                      </a>
                                    </Link>
                                    <div
                                      style={{
                                        width: "32px",
                                        display: "inline-block",
                                        float: "right"
                                      }}
                                    >
                                      <CircularProgressbar
                                        percentage={
                                          toFixed(
                                            player.rating_aggregate.aggregate
                                              .avg.rating
                                          ) * 10
                                        }
                                        text={toFixed(
                                          player.rating_aggregate.aggregate.avg
                                            .rating
                                        )}
                                        styles={circleStyle(
                                          player.rating_aggregate.aggregate.avg
                                            .rating
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </section>
                    </div>
                  );
                } else {
                  return "No Data, come back later";
                }
              }}
            </Query>
            {/* <div className="career-single">
              <div className="container">
                <div className="col-md-12">
                  <section>
                    <div className="inside">
                      <div className="top">
                        <h2 style={{ marginBottom: "0px", marginLeft: "44%" }}>
                          How To
                        </h2>
                      </div>
                      <div style={{ textAlign: "center" }} className="job">
                        <img src="/static/img/logo_dark.png" />
                        <h4>1. Join the community</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                        <h4>2. Watch and Rate Clips</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                        <h4>3. Add and Share Clips</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div> */}
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default defaultPage(Home);
