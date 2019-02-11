import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import { rateOptions, sortMoreOptions } from "../utils/Options";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
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
import { getUserClips } from "../graphql/queries/user/getUserClips";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon
} from "react-share";
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
  withFilter: boolean;
  searchDisabled: boolean;
  clips: any;
  playerProfile: any;
  clipLength: any;
  loading: boolean;
  isEmpty: boolean;

  userProfile: any;
}

let isLoggedIn;
let userId;

class User extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : query.id;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { createdAt: "desc_nulls_last", id: "desc" },
      filters: { id: { _eq: this.props.router.query.id } },
      count: 0,
      open: false,
      rating: 0,
      withFilter: false,
      searchDisabled: false,
      clips: [],
      clipLength: 0,
      playerProfile: {},
      loading: true,
      isEmpty: false,
      userProfile: {}
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
    console.log(this.state.clipLength);

    const data = await this.props.client.query({
      query: getUserClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    if (data.data.user[0].clipsByuserid != 0) {
      this.setState({
        clips: [...this.state.clips, ...data.data.user[0].clipsByuserid],
        clipLength:
          this.state.clipLength + data.data.user[0].clipsByuserid.length
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }
  };

  setFilters = async () => {
    let orderByOption;
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
      query: getUserClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.userClip],
      clipLength: data.data.userClip.length
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
    const data = await this.props.client.query({
      query: getUserClips,
      variables: {
        filters: { id: { _eq: this.props.router.query.id } },
        userId: this.props.router.query.id,
        offset: 0,
        limit: 12
      }
    });
    if (data.data.user[0]) {
      this.setState({
        loading: false,
        clips: data.data.user[0].clipsByuserid,
        clipLength: data.data.user[0].clipsByuserid.length,
        userProfile: {
          id: data.data.user[0].id,
          image: data.data.user[0].image,
          username: data.data.user[0].username,
          rating: data.data.user[0].ratings_aggregate.aggregate.avg.rating,
          ratingCount: data.data.user[0].ratings_aggregate.aggregate.count,
          clipsCount: data.data.user[0].clipsByuserid_aggregate.aggregate.count
        }
      });
    }
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { playerProfile, rating, loading, userProfile } = this.state;
    return (
      <Layout title="Vac.Tv | User Profile" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>User Profile</h1>
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
                          <img src={userProfile.image} alt="" />
                        </a>
                        <div className="item mr-auto">
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: 600
                            }}
                          >
                            <a href="#">{userProfile.username}</a>
                          </span>
                          <div className="star-rating" />
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
                                userProfile.rating ? userProfile.rating : 0
                              ) * 10
                            }
                            text={toFixed(
                              userProfile.rating ? userProfile.rating : 0
                            )}
                            styles={circleStyle(
                              userProfile.rating ? userProfile.rating : 0
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
                          {userProfile.ratingCount
                            ? userProfile.ratingCount
                            : 0}
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
                          {userProfile.clipsCount ? userProfile.clipsCount : 0}
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
                          Share Profile:
                        </span>
                        <FacebookShareButton
                          url={`https://vactv-web.herokuapp.com/user/${
                            this.props.router.query.id
                          }`}
                          quote={"Test"}
                          className="Demo__some-network__share-button"
                        >
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={`https://vactv-web.herokuapp.com/user/${
                            this.props.router.query.id
                          }`}
                          quote={"Test"}
                          className="Demo__some-network__share-button"
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
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
                              <div className="middle">
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
                                    {clip.map
                                      ? "🌍 " + clip.map
                                      : "📺 " + clip.type}{" "}
                                    |
                                    <span
                                      style={{ textTransform: "uppercase" }}
                                    >
                                      {clip.weapon ? (
                                        " 💢 " + clip.weapon
                                      ) : (
                                        <span
                                          style={{
                                            textTransform: "capitalize"
                                          }}
                                        >
                                          {" 💢 " + clip.category}
                                        </span>
                                      )}
                                    </span>
                                  </h6>
                                </div>
                              </div>

                              <div className="bottom">
                                <img
                                  src="https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                  alt="#"
                                />
                                <div className="cut-text">
                                  <span style={{ textTransform: "capitalize" }}>
                                    {clip.type === "user"
                                      ? clip.platform
                                      : clip.type}
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
                                    clipId: clip.id
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
                                      <img
                                        className="modalPlayerImg"
                                        src="https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                        alt=""
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

export default withRouter(User);
