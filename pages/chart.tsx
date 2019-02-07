import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import defaultPage from "../components/hocs/defaultPage";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
import { Query, Mutation } from "react-apollo";
import { getClipsWithFilter } from "../graphql/queries/clips/getClipsWithFilter";
import {
  emojiRating,
  toFixed,
  circleStyle,
  modalStyle,
  backdropStyle,
  medalPicker,
  medalStylePicker,
  filterModalStyle
} from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
import {
  mapOptions,
  categoryOptions,
  weaponOptions,
  rateOptions,
  sortChartOptions
} from "../utils/Options";
//@ts-ignore
import { Link } from "../server/routes";
import Links from "next/link";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import moment from "moment";

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
  weapon: any;
  category: any;
  map: any;
  showFilterModal: any;
}

class Chart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: "week",
      filters: {},
      open: false,
      rating: 0,
      weapon: null,
      category: null,
      showFilterModal: false,
      map: null,
      orderBy: {}
    };
  }

  onCloseModal = () => {
    this.setState({ open: false, showFilterModal: false, rating: 0 });
  };

  onOpenModal(id, event) {
    event.preventDefault();
    this.setState({
      open: {
        [id]: true
      }
    });
  }

  setFilters = () => {
    let withFilters: any = { isPublic: { _eq: true }, type: { _eq: "pro" } };
    if (this.state.map) {
      withFilters = { map: { _eq: this.state.map }, ...withFilters };
    }
    if (this.state.category) {
      withFilters = { category: { _eq: this.state.category }, ...withFilters };
    }
    if (this.state.weapon) {
      withFilters = { weapon: { _eq: this.state.weapon }, ...withFilters };
    }
    this.setState({
      filters: withFilters
    });
  };

  getMoreClips = fetchMore => {
    event.preventDefault();
    fetchMore({
      variables: {
        offset: 0,
        orderBy: this.state.orderBy,
        filters: this.state.filters
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.clip) return prev;
        this.setState({
          showFilterModal: false,
          weapon: null,
          category: null,
          map: null
        });
        return Object.assign({}, prev, {
          clip: [...fetchMoreResult.clip]
        });
      }
    });
  };

  handleChange = name => value => {
    if (!value) {
      return;
    }
    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      },
      () => this.setFilters()
    );
  };

  handleRateChange = name => value => {
    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      }
    );
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  open = () => {
    this.setState({ showFilterModal: true });
  };

  render() {
    const { isLoggedIn } = this.props;
    const { sort, rating, category, map, weapon } = this.state;

    return (
      <Layout title="Vac.Tv | Charts" isLoggedIn={isLoggedIn}>
        <header>
          <div className="menu">
            <div className="container">
              <ul className="list-unstyled">
                <li className="active">
                  <a>Top Clips 🎖️</a>
                </li>
                <li>
                  <Links href="topplayers">
                    <a>Top Pro Players 🏅</a>
                  </Links>
                </li>
                <li>
                  <Links href="topplayers">
                    <a>Hall of Fame 🏆</a>
                  </Links>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <main>
          <div
            style={{ padding: "25px 0 80px" }}
            className="freelancers sidebar"
          >
            <div className="container">
              <Query
                query={getClipsWithFilter}
                variables={{
                  filters: { isPublic: { _eq: true }, type: { _eq: "pro" } },
                  orderBy: {
                    ratings_aggregate: {
                      avg: { rating: "desc_nulls_last" },
                      sum: { rating: "desc_nulls_last" }
                    },
                    id: "desc"
                  },
                  offset: 0,
                  limit: 8
                }}
              >
                {({ fetchMore, loading, error, data }) => {
                  console.log("TCL: render -> data", data.clip);

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
                            marginBottom: "24px"
                          }}
                        >
                          This Month: Top 8
                        </h1>
                        <div className="buttons">
                          <button
                            onClick={() => this.open()}
                            className="chartFilter"
                          >
                            <i
                              className="fas fa-sort-amount-down"
                              style={{ marginRight: "5px" }}
                            />
                            Filter & Sort
                          </button>
                          <Modal
                            onHide={this.onCloseModal}
                            style={filterModalStyle()}
                            aria-labelledby="modal-label"
                            show={this.state.showFilterModal}
                            renderBackdrop={this.renderBackdrop}
                          >
                            <div
                              style={{
                                width: "25%",
                                paddingBottom: "20px",
                                paddingTop: "20px",
                                backgroundColor: "#fafafa",
                                borderRadius: "5px"
                              }}
                            >
                              <h5
                                style={{
                                  marginLeft: "20px",
                                  marginBottom: "20px"
                                }}
                              >
                                Filter & Sort
                              </h5>
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="chartSelect"
                                onChange={this.handleChange("category")}
                                value={category ? category.value : ""}
                                isSearchable={true}
                                placeholder="Category"
                                options={categoryOptions}
                              />
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="chartSelect"
                                onChange={this.handleChange("map")}
                                value={map ? map.value : ""}
                                isSearchable={false}
                                placeholder="Map"
                                options={mapOptions}
                              />
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="chartSelect"
                                onChange={this.handleChange("weapon")}
                                value={weapon ? weapon.value : ""}
                                isSearchable={true}
                                placeholder="Weapon"
                                options={weaponOptions}
                              />
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="chartSelect"
                                onChange={this.handleChange("sort")}
                                value={sort ? sort.value : ""}
                                isSearchable={false}
                                placeholder="Sort By"
                                options={sortChartOptions}
                              />
                              <button
                                onClick={() => this.getMoreClips(fetchMore)}
                                className="filterSearchButton"
                              >
                                Search
                              </button>
                              <button
                                style={{ marginTop: "10px" }}
                                onClick={this.onCloseModal}
                                className="filterSearchButton"
                              >
                                Close
                              </button>
                            </div>
                          </Modal>
                        </div>
                      </div>

                      <div className="row">
                        {data.clip.map((clip, i) => (
                          <div key={clip.id} className="col-md-3">
                            <div className="inside">
                              <span className="topRatedThisMonth">
                                # {i + 1}
                              </span>

                              <a
                                onClick={this.onOpenModal.bind(this, clip.id)}
                                href="#"
                              >
                                <span className={medalStylePicker(i)}>
                                  {medalPicker(i)}
                                </span>

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
                                      textTransform: "capitalize",
                                      fontWeight: 800,
                                      fontSize: "19px"
                                    }}
                                  >
                                    <Link route="clip" id={clip.id}>
                                      <a>
                                        {clip.category}

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
                                    <span>
                                      {clip.players[0] === undefined
                                        ? ""
                                        : clip.players[0].player.nickName}
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
                                    playerId:
                                      clip.players[0] === undefined
                                        ? ""
                                        : clip.players[0].player.id,
                                    teamId:
                                      clip.players[0] === undefined
                                        ? ""
                                        : clip.players[0].player.teamId,
                                    eventId:
                                      clip.events[0] === undefined
                                        ? ""
                                        : clip.events[0].eventId
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
                                                : clip.players[0].player
                                                    .nickName
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
                                          onChange={this.handleRateChange(
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

export default defaultPage(Chart);
