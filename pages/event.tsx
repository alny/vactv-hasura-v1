import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import { sortMoreOptions, rateOptions } from "../utils/Options";
import { ToastContainer } from "react-toastify";
import {
  backdropStyle,
  emojiRating,
  toFixed,
  circleStyle,
  modalStyle
} from "../utils/Styles";
import { withRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import { getSingleEventClips } from "../graphql/queries/event/getSingleEvent";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { Mutation } from "react-apollo";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
//@ts-ignore
import { Link } from "../server/routes";
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
  filters: any;
  open: any;
  rating: any;
  searchDisabled: boolean;
  clips: any;
  eventProfile: any;
  clipLength: any;
  loading: any;
  isEmpty: any;
}

let isLoggedIn;
let userId;
let eventId;

class Event extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : "";
    eventId = query.id;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { id: "desc" },
      filters: { id: { _eq: this.props.router.query.id } },
      count: 0,
      open: false,
      rating: 0,
      searchDisabled: false,
      clips: [],
      clipLength: 0,
      eventProfile: {},
      loading: true,
      isEmpty: false
    };
  }

  onCloseModal = () => {
    this.setState({ open: false, rating: 0 });
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
    const data = await this.props.client.query({
      query: getSingleEventClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    if (data.data.event[0].eventClips.length != 0) {
      this.setState({
        clips: [...this.state.clips, ...data.data.event[0].eventClips],
        clipLength: this.state.clipLength + data.data.event[0].eventClips.length
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }
  };

  setFilters = async () => {
    let orderByOption;
    this.setState({ clipLength: 0 });
    if (this.state.sort === "Newest") {
      orderByOption = {
        clip: {
          createdAt: "desc_nulls_last",
          id: "desc"
        }
      };
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
      query: getSingleEventClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.event[0].eventClips],
      clipLength: data.data.event[0].eventClips.length
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
    if (isValid(eventId || this.props.router.query.id)) {
      const data = await this.props.client.query({
        query: getSingleEventClips,
        variables: {
          filters: {
            id: { _eq: !eventId ? this.props.router.query.id : eventId }
          },
          orderBy: this.state.orderBy,
          offset: 0,
          limit: 12
        }
      });
      if (data.data.event[0]) {
        this.setState({
          loading: false,
          clips: data.data.event[0].eventClips,
          clipLength: data.data.event[0].eventClips.length,
          eventProfile: {
            id: data.data.event[0].id,
            name: data.data.event[0].name,
            image: data.data.event[0].image,
            clipCount: data.data.event[0].eventClips_aggregate.aggregate.count
          }
        });
      }
    }
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { eventProfile, rating, loading } = this.state;
    return (
      <Layout title="Vac.Tv | Pro Player" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>{eventProfile ? eventProfile.name : null} 🔥</h1>
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
                            src={
                              eventProfile
                                ? eventProfile.image
                                : "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                            }
                            alt=""
                          />
                        </a>
                        <div className="item mr-auto">
                          <div className="star-rating">
                            {eventProfile ? eventProfile.name : null}
                          </div>
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
                          Total Clips:
                        </span>

                        <span className="totalRating">
                          {" "}
                          {eventProfile ? eventProfile.clipCount : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <section>
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
                                    <Link route="clip" id={clip.clip.id}>
                                      <a>
                                        {clip.clip.category}{" "}
                                        {emojiRating(
                                          clip.clip.ratings_aggregate.aggregate
                                            .avg.rating
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
                                  route="player"
                                  id={
                                    clip.clip.players[0] === undefined
                                      ? ""
                                      : clip.clip.players[0].player.id
                                  }
                                >
                                  <a>
                                    <img
                                      src={
                                        clip.clip.players[0] === undefined
                                          ? ""
                                          : clip.clip.players[0].player.image
                                      }
                                      alt={
                                        clip.clip.players[0] === undefined
                                          ? ""
                                          : clip.clip.players[0].player.nickName
                                      }
                                    />
                                    <span>
                                      {clip.clip.players[0] === undefined
                                        ? ""
                                        : clip.clip.players[0].player.nickName}
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
                                        clip.clip.ratings_aggregate.aggregate
                                          .avg.rating
                                      ) * 10
                                    }
                                    text={toFixed(
                                      clip.clip.ratings_aggregate.aggregate.avg
                                        .rating
                                    )}
                                    styles={circleStyle(
                                      clip.clip.ratings_aggregate.aggregate.avg
                                        .rating
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            <Mutation
                              mutation={RATE_CLIP_MUTATION}
                              variables={{
                                userId: !isLoggedIn ? null : userId,
                                rating,
                                objects: [
                                  {
                                    rating,
                                    userId: !isLoggedIn ? null : userId,
                                    clipId: clip.clip.id,
                                    playerId:
                                      clip.clip.players[0] === undefined
                                        ? ""
                                        : clip.clip.players[0].player.id,
                                    teamId:
                                      clip.clip.players[0] === undefined
                                        ? ""
                                        : clip.clip.players[0].player.teamId,
                                    eventId: !eventId
                                      ? this.props.router.query.id
                                      : eventId
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
                                      <Link
                                        route="player"
                                        id={
                                          clip.clip.players[0] === undefined
                                            ? ""
                                            : clip.clip.players[0].player.id
                                        }
                                      >
                                        <a>
                                          <img
                                            className="modalPlayerImg"
                                            src={
                                              clip.clip.players[0] === undefined
                                                ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                                : clip.clip.players[0].player
                                                    .image
                                            }
                                            alt={
                                              clip.clip.players[0] === undefined
                                                ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                                : clip.clip.players[0].player
                                                    .nickName
                                            }
                                          />
                                          <span className="modalPlayerImgText">
                                            {clip.clip.players[0] === undefined
                                              ? ""
                                              : clip.clip.players[0].player
                                                  .nickName}
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
                                          onChange={this.handleChange("rating")}
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
                  </section>
                </div>
              </div>
              {this.state.clipLength < 12 || this.state.isEmpty ? null : (
                <div className="load-more">
                  <a
                    onClick={() => this.getMoreClips()}
                    className="btn btn-primary"
                    rel="next"
                  >
                    Load More
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default withRouter(Event);
