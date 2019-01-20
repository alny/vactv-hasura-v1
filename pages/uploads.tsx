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
import InfiniteScroll from "react-infinite-scroll-component";
import { getUserUploads } from "../graphql/queries/user/getUserUploadClips";
import privatePage from "../components/hocs/privatePage";

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
  clipLength: any;
}

class Uploads extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { createdAt: "desc_nulls_last" },
      filters: {},
      count: 0,
      open: false,
      rating: 0,
      withFilter: false,
      searchDisabled: false,
      clips: [],
      clipLength: 0
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
      query: getUserUploads,
      variables: {
        filters: {
          userId: {
            _eq: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub
          }
        },
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    this.setState({
      clips: [...this.state.clips, ...data.data.clip],
      clipLength: this.state.clipLength + data.data.clip[0].length
    });
  };

  setFilters = async () => {
    let orderByOption;
    if (this.state.sort === "Newest") {
      orderByOption = { createdAt: "desc_nulls_last" };
    }
    if (this.state.sort === "Most Votes") {
      orderByOption = { ratings_aggregate: { count: "desc_nulls_last" } };
    }
    if (this.state.sort === "Highest Rated") {
      orderByOption = {
        ratings_aggregate: { avg: { rating: "desc_nulls_last" } }
      };
    }
    const data = await this.props.client.query({
      query: getUserUploads,
      variables: {
        filters: {
          userId: {
            _eq: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub
          }
        },
        offset: 0,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.clip]
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

  async componentDidMount() {
    console.log(this.props);
    const data = await this.props.client.query({
      query: getUserUploads,
      variables: {
        filters: {
          userId: {
            _eq: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub
          }
        },
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    console.log(data.data.clip);
    this.setState({
      clips: data.data.clip,
      clipLength: data.data.clip_aggregate.aggregate.count
    });
  }

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
    const { isLoggedIn, loggedInUser } = this.props;
    const { rating } = this.state;
    return (
      <Layout title="Vac.Tv | Uploads by you" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>Uploads by you:</h1>
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
                          {this.state.clipLength}
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
                      hasMore={false}
                      loading={<div>Loading</div>}
                    >
                      <div className="row">
                        {this.state.clips.map(clip => (
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
                                    userId: !isLoggedIn
                                      ? null
                                      : loggedInUser.sub,
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
                                      <h4
                                        style={{
                                          marginLeft: "15px",
                                          textTransform: "capitalize",
                                          display: "inline-block",
                                          fontSize: "16px",
                                          marginTop: "10px"
                                        }}
                                      >
                                        {clip.map} | 💢{" "}
                                        <span
                                          style={{
                                            textTransform: "uppercase"
                                          }}
                                        >
                                          {clip.weapon}
                                        </span>
                                      </h4>
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

export default privatePage(Uploads);
