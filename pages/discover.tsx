import * as React from "react";
import Layout from "../components/Layout";
import { Query, Mutation } from "react-apollo";
import { getClipsWithFilter } from "../graphql/queries/clips/getClipsWithFilter";
import { sortOptions, rateOptions } from "../utils/Options";
import Select from "react-select";
import dateFormat from "dateformat";
import defaultPage from "../components/hocs/defaultPage";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
import {
  modalStyle,
  backdropStyle,
  circleStyle,
  emojiRating,
  toFixed
} from "../utils/Styles";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
//@ts-ignore
import { Link } from "../server/routes";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
};

interface State {
  sort: any;
  orderBy: any;
  filters: any;
  open: any;
  rating: any;
  withFilter: any;
}

class Discover extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: "latest",
      orderBy: {
        createdAt: "desc_nulls_last"
      },
      filters: {},
      open: false,
      rating: 0,
      withFilter: false
    };
  }

  componentDidMount() {}

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
    // event.preventDefault();
    fetchMore({
      variables: {
        orderBy: this.state.orderBy,
        limit: 12,
        offset: offset,
        filters: this.state.filters
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.clip) return prev;
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

  filters = (fetchMore, length) => {
    var now = new Date();
    var startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    var endofDay = new Date();
    endofDay.setHours(23, 59, 59, 999);

    if (this.state.sort === "today") {
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } }
          },
          filters: {
            _and: [
              { createdAt: { _gte: startOfDay.toISOString() } },
              { createdAt: { _lte: endofDay.toISOString() } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
    if (this.state.sort === "week") {
      var firstday = new Date(now.setDate(now.getDate() - now.getDay()));
      var lastday = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      var firstDayFormatted = dateFormat(firstday, "isoDate");
      var LastDayFormatted = dateFormat(lastday, "isoDate");
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } }
          },
          filters: {
            _and: [
              { createdAt: { _gte: firstDayFormatted } },
              { createdAt: { _lte: LastDayFormatted } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
    if (this.state.sort === "month") {
      var firstday = new Date(now.setDate(now.getDate() - now.getDay()));
      var lastday = new Date(now.setDate(now.getDate() - now.getDay() + 30));
      var firstDayFormatted = dateFormat(firstday, "isoDate");
      var LastDayFormatted = dateFormat(lastday, "isoDate");
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } }
          },
          filters: {
            _and: [
              { createdAt: { _gte: firstDayFormatted } },
              { createdAt: { _lte: LastDayFormatted } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
  };

  handleSelectChange = (name, fetchMore, length) => value => {
    event.preventDefault();
    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      },
      () => this.filters(fetchMore, length)
    );
  };

  handleChange = name => value => {
    //@ts-ignore
    this.setState({
      [name]: value.value
    });
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
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

  render() {
    const { sort, orderBy, rating } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Discover Clips" isLoggedIn={isLoggedIn}>
        <main>
          <div style={{ paddingTop: "30px" }} className="freelancers sidebar">
            <div className="container">
              <Query
                query={getClipsWithFilter}
                variables={{
                  orderBy,
                  offset: 0,
                  limit: 12
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
                  return (
                    <>
                      <div className="above">
                        <h1
                          style={{
                            marginBottom: "24px",
                            textTransform: "capitalize"
                          }}
                        >
                          Discover - {this.state.sort}
                        </h1>
                        <div className="buttons">
                          <Select
                            onChange={this.handleSelectChange(
                              "sort",
                              fetchMore,
                              data.clip ? data.clip.length : 0
                            )}
                            menuPlacement="auto"
                            minMenuHeight={200}
                            className="sortBySelect"
                            value={sort}
                            isSearchable={false}
                            placeholder="Sort By"
                            options={sortOptions}
                          />
                        </div>
                      </div>

                      <section>
                        <InfiniteScroll
                          dataLength={data.clip ? data.clip.length : 0}
                          next={() =>
                            this.getMoreClips(
                              fetchMore,
                              data.clip ? data.clip.length : 0
                            )
                          }
                          style={{ overflow: "visible" }}
                          hasMore={
                            data.clip
                              ? data.clip.length !==
                                data.clip_aggregate.aggregate.count
                              : false
                          }
                          loading={<div>Loading</div>}
                          endMessage={
                            <p style={{ textAlign: "center" }}>
                              <b>Yay! You have seen it all</b>
                            </p>
                          }
                        >
                          <div className="row">
                            {data.clip.map(clip => (
                              <div key={clip.id} className="col-md-3">
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
                                  <div className="middle">
                                    <div>
                                      <h3
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        <Link route="clip" id={clip.id}>
                                          <a>
                                            {clip.category}{" "}
                                            {emojiRating(
                                              clip.ratings_aggregate.aggregate
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
                                          <h4
                                            style={{
                                              marginLeft: "15px",
                                              textTransform: "capitalize",
                                              display: "inline-block",
                                              fontSize: "16px",
                                              marginTop: "10px"
                                            }}
                                          >
                                            {clip.player.nickName} | 🌍{" "}
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
                        </InfiniteScroll>
                      </section>
                    </>
                  );
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

export default defaultPage(Discover);
