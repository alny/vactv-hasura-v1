import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import { sortOptions, rateOptions } from "../utils/Options";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
import { Query, Mutation } from "react-apollo";
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
  withFilter: boolean;
  searchDisabled: boolean;
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
      sort: "today",
      orderBy: {},
      filters: {},
      count: 0,
      open: false,
      rating: 0,
      withFilter: false,
      searchDisabled: false
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

  getMoreClips = (fetchMore, offset) => {
    console.log(offset);
    event.preventDefault();
    fetchMore({
      variables: {
        offset,
        orderBy: this.state.orderBy,
        filters: this.state.filters
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.clip) return prev;
        this.setState({
          count: offset
        });
        if (this.state.withFilter) {
          this.setState({ withFilter: false });
          return Object.assign({}, prev, {
            clip: [...fetchMoreResult.clip]
          });
        }
        return Object.assign({}, prev, {
          clip: [...prev.clip, ...fetchMoreResult.clip]
        });
      }
    });
  };

  setFilters = () => {
    this.setState({
      orderBy: { ratings_aggregate: { avg: { rating: "desc" } } }
    });
  };

  handleChange = name => value => {
    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      },
      () => this.setFilters()
    );
  };

  submitRate = async rateClip => {
    const notifySuccess = () => toast.success("😄 Rating submitted!");

    if (this.state.rating) {
      try {
        const { data } = await rateClip();
        console.log(data);

        if (data.insert_rating) {
          notifySuccess();
          this.onCloseModal();
        } else {
          console.log("Already rated");
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { sort, count, rating } = this.state;
    const {
      router: { query }
    } = this.props;
    return (
      <Layout title="Vac.Tv | Pro Player" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <Query
                query={getTeamWithPlayers}
                variables={{
                  teamId: !teamId ? query.id : teamId
                }}
              >
                {({ fetchMore, loading, error, data }) => {
                  if (loading)
                    return (
                      <i
                        className="fa fa-circle-o-notch fa-spin"
                        style={{ fontSize: "24px" }}
                      />
                    );
                  if (error) return `Error!: ${error}`;
                  if (
                    typeof data.team != "undefined" &&
                    data.team != null &&
                    data.team.length != null &&
                    data.team.length > 0
                  ) {
                    return (
                      <>
                        <div className="above">
                          <h1>Pro Team</h1>
                          <div className="buttons">
                            <Select
                              menuPlacement="auto"
                              minMenuHeight={200}
                              className="sortBySelect"
                              isSearchable={false}
                              placeholder="Sort By"
                              options={sortOptions}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="accordion">
                              <div className="card">
                                <div className="singlePlayer">
                                  <a href="#">
                                    <img src={data.team[0].image} alt="" />
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
                                      {data.team[0].name}
                                    </div>
                                  </div>
                                </div>
                                {data.team.map(team =>
                                  team.players.map(player => (
                                    <div
                                      key={player.id}
                                      className="singlePlayer"
                                    >
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
                                              player.rating_aggregate.aggregate
                                                .avg.rating
                                            ) * 10
                                          }
                                          text={toFixed(
                                            player.rating_aggregate.aggregate
                                              .avg.rating
                                          )}
                                          styles={circleStyle(
                                            player.rating_aggregate.aggregate
                                              .avg.rating
                                          )}
                                        />
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-9">
                            <section>
                              <div className="row">
                                {data.clip.map(clip => (
                                  <div key={clip.id} className="col-md-4">
                                    <div className="inside">
                                      <a
                                        onClick={this.onOpenModal.bind(
                                          this,
                                          clip.id
                                        )}
                                        href="#"
                                      >
                                        <img
                                          className="card-img-top"
                                          src={clip.thumbNail}
                                          alt={clip.url}
                                        />
                                      </a>
                                      <a
                                        onClick={this.onOpenModal.bind(
                                          this,
                                          clip.id
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
                                            <Link route="clip" id={clip.id}>
                                              <a>
                                                {clip.category}{" "}
                                                {emojiRating(
                                                  clip.ratings_aggregate
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
                                        <Link
                                          route="player"
                                          id={clip.player.id}
                                        >
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
                                                clip.ratings_aggregate.aggregate
                                                  .avg.rating
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
                                                      clip.ratings_aggregate
                                                        .aggregate.avg.rating
                                                    )}
                                                    styles={circleStyle(
                                                      clip.ratings_aggregate
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
                                                    this.submitRate(rateClip)
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
                              <div className="load-more">
                                <a
                                  //@ts-ignore
                                  href="#"
                                  className="btn btn-primary"
                                  rel="next"
                                >
                                  Load More{count}
                                </a>
                              </div>
                            </section>
                          </div>
                        </div>
                      </>
                    );
                  } else {
                    return "No Player Found";
                  }
                }}
              </Query>
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default withRouter(Team);
