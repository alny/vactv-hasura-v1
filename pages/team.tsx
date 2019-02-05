import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import { rateOptions, sortMoreOptions } from "../utils/Options";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer } from "react-toastify";
import { Mutation } from "react-apollo";
import {
  emojiRating,
  toFixed,
  circleStyle,
  modalStyle,
  backdropStyle
} from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
//@ts-ignore
import { Link } from "../server/routes";
import { withRouter } from "next/router";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import { getTeamWithPlayers } from "../graphql/queries/team/getTeamWithPlayers";
import { submitRate } from "../utils/SharedFunctions/submitRating";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
  router: any;
};

interface State {
  sort: any;
  orderBy: any;
  filters: any;
  open: any;
  rating: any;
  clips: any;
  teamProfile: any;
  clipLength: any;
  loading: boolean;
}

let isLoggedIn;
let teamId;
let userId;

class Team extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : "";
    teamId = query.id;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { createdAt: "desc_nulls_last", id: "desc" },
      filters: {
        player: {
          teamId: { _eq: !teamId ? this.props.router.query.id : teamId }
        }
      },
      open: false,
      rating: 0,
      clips: [],
      clipLength: 0,
      teamProfile: {},
      loading: true
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

  getMoreClips = async () => {
    console.log(this.state.clipLength);

    const data = await this.props.client.query({
      query: getTeamWithPlayers,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        teamId: !teamId ? this.props.router.query.id : teamId,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    this.setState({
      clips: [...this.state.clips, ...data.data.clip],
      clipLength: this.state.clipLength + data.data.clip.length
    });
  };

  setFilters = async () => {
    let orderByOption;
    this.setState({ clipLength: 0 });
    if (this.state.sort === "Newest") {
      orderByOption = { createdAt: "desc_nulls_last", id: "desc" };
    }
    if (this.state.sort === "Most Votes") {
      orderByOption = {
        ratings_aggregate: { count: "desc_nulls_last" },
        id: "desc"
      };
    }
    if (this.state.sort === "Highest Rated") {
      orderByOption = {
        ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
        id: "desc"
      };
    }
    const data = await this.props.client.query({
      query: getTeamWithPlayers,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        teamId: !teamId ? this.props.router.query.id : teamId,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.clip],
      clipLength: data.data.clip.length
    });
  };


  async componentDidMount() {
    const data = await this.props.client.query({
      query: getTeamWithPlayers,
      variables: {
        filters: {
          player: {
            teamId: { _eq: !teamId ? this.props.router.query.id : teamId }
          }
        },
        teamId: !teamId ? this.props.router.query.id : teamId,
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    this.setState({
      loading: false,
      clips: data.data.clip,
      clipLength: data.data.clip.length,
      teamProfile: {
        id: data.data.team[0].id,
        name: data.data.team[0].name,
        image: data.data.team[0].image,
        players: data.data.team[0].players
      }
    });
    console.log(this.state);
  }

  handleChange = name => value => {
    this.setState(
      //@ts-ignore
      {
        [name]: value.value,
        clipLength: 0
      },
      () => this.setFilters()
    );
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { rating, teamProfile, clips, loading, clipLength } = this.state;

    return (
      <Layout title="Vac.Tv | Pro Team" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <>
                <div className="above">
                  <h1>Pro Team</h1>
                  <div className="buttons">
                    <Select
                      menuPlacement="auto"
                      minMenuHeight={200}
                      onChange={this.handleChange("sort")}
                      className="sortBySelect"
                      isSearchable={false}
                      placeholder="Sort By"
                      options={sortMoreOptions}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="accordion">
                      <div className="card">
                        <div className="singlePlayer">
                          <a href="#">
                            <img
                              style={{ borderRadius: "0" }}
                              src={teamProfile ? teamProfile.image : null}
                              alt=""
                            />
                          </a>
                          <div className="item mr-auto">
                            <span
                              style={{
                                fontSize: "20px",
                                fontWeight: 600
                              }}
                            >
                              Team
                            </span>
                            <div className="star-rating">
                              {teamProfile ? teamProfile.name : null}
                            </div>
                          </div>
                        </div>
                        {!teamProfile.players
                          ? null
                          : teamProfile.players.map(player => (
                              <div key={player.id} className="singlePlayer">
                                <Link route="player" id={player.id}>
                                  <a>
                                    <img src={player.image} alt="" />
                                  </a>
                                </Link>
                                <div className="item mr-auto">
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600
                                    }}
                                  >
                                    <Link route="player" id={player.id}>
                                      <a>{player.nickName}</a>
                                    </Link>
                                  </span>
                                </div>
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
                                        player.rating_aggregate.aggregate.avg
                                          .rating
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
                            ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <section>
                      <div className="row">
                        {loading ? (
                          <div className="clipLoader" />
                        ) : (
                          clips.map(clip => (
                            <div key={clip.id} className="col-md-4">
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
                                <div
                                  style={{
                                    borderBottom: "1px solid #fbfcfd"
                                  }}
                                  className="middle"
                                >
                                  <div>
                                    <h3
                                      style={{
                                        textTransform: "capitalize"
                                      }}
                                    >
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
                                        style={{
                                          textTransform: "uppercase"
                                        }}
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
                                      userId: !isLoggedIn ? null : userId,
                                      clipId: clip.id,
                                      playerId: clip.player.id,
                                      teamId: clip.player.teamId,
                                      eventId: clip.event.id
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
                          ))
                        )}
                      </div>
                      {clipLength < 12 ? null : (
                        <div className="load-more">
                          <a
                            onClick={() => this.getMoreClips()}
                            href="#"
                            className="btn btn-primary"
                            rel="next"
                          >
                            Load More
                          </a>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </>
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default withRouter(Team);
