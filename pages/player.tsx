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
import { getSinglePlayerClips } from "../graphql/queries/player/getSinglePlayerClips";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import { isValid } from "../utils/SharedFunctions/isUUIDValid";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
  router: any;
};

interface State {
  sort: any;
  count: Number;
  orderBy: any;
  open: any;
  rating: any;
  searchDisabled: boolean;
  clips: any;
  playerProfile: any;
  clipLength: any;
  loading: boolean;
}

let isLoggedIn;
let userId;
let playerId;

class Player extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : "";
    playerId = query.id;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { clip: { id: "desc" } },
      count: 0,
      open: false,
      rating: 0,
      searchDisabled: false,
      clips: [],
      clipLength: 0,
      playerProfile: {},
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
      query: getSinglePlayerClips,
      variables: {
        playerId: !playerId ? this.props.router.query.id : playerId,
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    this.setState({
      clips: [...this.state.clips, ...data.data.player[0].playerClips],
      clipLength: this.state.clipLength + data.data.player[0].playerClips.length
    });
  };

  setFilters = async () => {
    let orderByOption;
    if (this.state.sort === "Newest") {
      orderByOption = { clip: { createdAt: "desc_nulls_last", id: "desc" } };
    }
    if (this.state.sort === "Most Votes") {
      orderByOption = {
        clip: {
          ratings_aggregate: { count: "desc_nulls_last" },
          id: "desc"
        }
      };
    }
    if (this.state.sort === "Highest Rated") {
      orderByOption = {
        clip: {
          ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
          id: "desc"
        }
      };
    }
    const data = await this.props.client.query({
      query: getSinglePlayerClips,
      variables: {
        playerId: !playerId ? this.props.router.query.id : playerId,
        offset: this.state.clipLength,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.player[0].playerClips],
      clipLength: data.data.player[0].playerClips.length
    });
  };

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

  async componentDidMount() {
    if (isValid(playerId || this.props.router.query.id)) {
      const data = await this.props.client.query({
        query: getSinglePlayerClips,
        variables: {
          playerId: !playerId ? this.props.router.query.id : playerId,
          orderBy: this.state.orderBy,
          offset: 0,
          limit: 12
        }
      });
      if (data.data.player) {
        this.setState({
          loading: false,
          clips: data.data.player[0].playerClips,
          clipLength: data.data.player[0].playerClips.length,
          playerProfile: {
            id: data.data.player[0].id,
            name: data.data.player[0].name,
            nickName: data.data.player[0].nickName,
            image: data.data.player[0].image,
            rating: data.data.player[0].rating_aggregate,
            clipCount:
              data.data.player[0].playerClips_aggregate.aggregate.count,
            team: data.data.player[0].team
          }
        });
      }
    }
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { playerProfile, rating, loading } = this.state;
    return (
      <Layout title="Vac.Tv | Pro Player" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>Pro Player</h1>
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
                            src={playerProfile ? playerProfile.image : null}
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
                            <a href="#">
                              {playerProfile ? playerProfile.nickName : null}
                            </a>
                          </span>
                          <div className="star-rating">
                            {playerProfile ? playerProfile.name : null}
                          </div>
                        </div>
                      </div>
                      <div className="singlePlayer">
                        <Link
                          route="team"
                          id={playerProfile.team ? playerProfile.team.id : null}
                        >
                          <a>
                            <img
                              src={
                                playerProfile.team
                                  ? playerProfile.team.image
                                  : "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                              }
                              alt=""
                            />
                          </a>
                        </Link>
                        <div className="item mr-auto">
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: 600
                            }}
                          >
                            <a href="#">Team </a>
                          </span>
                          <div className="star-rating">
                            <Link
                              route="team"
                              id={
                                playerProfile.team
                                  ? playerProfile.team.id
                                  : null
                              }
                            >
                              <a>
                                {playerProfile.team
                                  ? playerProfile.team.name
                                  : null}
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="singlePlayer">
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginRight: "82px"
                          }}
                        >
                          Vac Score:
                        </span>
                        <div
                          style={{
                            width: "42px",
                            display: "inline-block",
                            float: "right"
                          }}
                        >
                          <CircularProgressbar
                            percentage={
                              toFixed(
                                playerProfile.rating
                                  ? playerProfile.rating.aggregate.avg.rating
                                  : 0
                              ) * 10
                            }
                            text={toFixed(
                              playerProfile.rating
                                ? playerProfile.rating.aggregate.avg.rating
                                : 0
                            )}
                            styles={circleStyle(
                              playerProfile.rating
                                ? playerProfile.rating.aggregate.avg.rating
                                : 0
                            )}
                          />
                        </div>
                      </div>
                      <div className="singlePlayer">
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginRight: "10px"
                          }}
                        >
                          Total Ratings:
                        </span>

                        <span className="totalRating">
                          {" "}
                          {playerProfile.rating
                            ? playerProfile.rating.aggregate.count
                            : null}
                        </span>
                      </div>
                      <div className="singlePlayer">
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginRight: "10px"
                          }}
                        >
                          Total Clips:
                        </span>

                        <span className="totalRating">
                          {" "}
                          {playerProfile ? playerProfile.clipCount : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <section>
                    <InfiniteScroll
                      dataLength={this.state.clipLength}
                      next={() => this.getMoreClips()}
                      style={{ overflow: "visible" }}
                      hasMore={
                        playerProfile.clipCount !== this.state.clipLength
                      }
                      loading={<div>Loading</div>}
                    >
                      <div className="row">
                        {loading ? (
                          <div className="clipLoader" />
                        ) : (
                          this.state.clips.map(clip => (
                            <div key={clip.clip.id} className="col-md-4">
                              <div className="inside">
                                <a
                                  onClick={this.onOpenModal.bind(
                                    this,
                                    clip.clip.id
                                  )}
                                  href="#"
                                >
                                  <img
                                    className="card-img-top"
                                    src={clip.clip.thumbNail}
                                    alt={clip.clip.url}
                                  />
                                </a>
                                <a
                                  onClick={this.onOpenModal.bind(
                                    this,
                                    clip.clip.id
                                  )}
                                  href="#"
                                  className="play"
                                />
                                <div className="middle">
                                  <div>
                                    <h3
                                      style={{
                                        textTransform: "capitalize"
                                      }}
                                    >
                                      <Link route="clip" id={clip.clip.id}>
                                        <a>
                                          {clip.clip.category}{" "}
                                          {emojiRating(
                                            clip.clip.ratings_aggregate
                                              .aggregate.avg.rating
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
                                      🌍 {clip.clip.map} | 💢{" "}
                                      <span
                                        style={{
                                          textTransform: "uppercase"
                                        }}
                                      >
                                        {clip.clip.weapon}
                                      </span>
                                    </h6>
                                  </div>
                                </div>

                                <div className="bottom">
                                  <Link
                                    route="event"
                                    id={
                                      clip.clip.events[0] === undefined
                                        ? ""
                                        : clip.clip.events[0].event.id
                                    }
                                  >
                                    <a>
                                      <img
                                        src={
                                          clip.clip.events[0] === undefined
                                            ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                            : clip.clip.events[0].event.image
                                        }
                                        alt={
                                          clip.clip.events[0] === undefined
                                            ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                            : clip.clip.events[0].event.name
                                        }
                                      />
                                      <div className="cut-text">
                                        <span>
                                          {clip.clip.events[0] === undefined
                                            ? ""
                                            : clip.clip.events[0].event.name}
                                        </span>
                                      </div>
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
                                          clip.clip.ratings_aggregate.aggregate
                                            .avg.rating
                                        ) * 10
                                      }
                                      text={toFixed(
                                        clip.clip.ratings_aggregate.aggregate
                                          .avg.rating
                                      )}
                                      styles={circleStyle(
                                        clip.clip.ratings_aggregate.aggregate
                                          .avg.rating
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
                                      clipId: clip.clip.id,
                                      playerId: !playerId
                                        ? this.props.router.query.id
                                        : playerId,
                                      teamId: playerProfile.team.id,
                                      eventId:
                                        clip.clip.events[0] === undefined
                                          ? ""
                                          : clip.clip.events[0].event.id
                                    }
                                  ]
                                }}
                              >
                                {(rateClip, {}) => (
                                  <Modal
                                    onHide={this.onCloseModal}
                                    style={modalStyle()}
                                    aria-labelledby="modal-label"
                                    show={!!this.state.open[clip.clip.id]}
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
                                          {clip.clip.category +
                                            " on " +
                                            clip.clip.map +
                                            " with a " +
                                            clip.clip.weapon}
                                        </h4>
                                      </div>
                                      <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                          className="embed-responsive-item"
                                          frameBorder="false"
                                          src={clip.clip.url}
                                        />
                                      </div>
                                      <div
                                        style={{
                                          marginTop: "10px",
                                          marginRight: "10px",
                                          height: "28px"
                                        }}
                                      >
                                        <img
                                          className="modalPlayerImg"
                                          src={
                                            playerProfile === null
                                              ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                              : playerProfile.image
                                          }
                                          alt={
                                            playerProfile === null
                                              ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                              : playerProfile.nickName
                                          }
                                        />
                                        <span className="modalPlayerImgText">
                                          {playerProfile === null
                                            ? ""
                                            : playerProfile.nickName}
                                        </span>
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
                                                  clip.clip.ratings_aggregate
                                                    .aggregate.avg.rating
                                                ) * 10
                                              }
                                              text={toFixed(
                                                clip.clip.ratings_aggregate
                                                  .aggregate.avg.rating
                                              )}
                                              styles={circleStyle(
                                                clip.clip.ratings_aggregate
                                                  .aggregate.avg.rating
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
                    </InfiniteScroll>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default withRouter(Player);
