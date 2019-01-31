import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import {
  sortMoreOptions,
  mapOptions,
  categoryOptions,
  weaponOptions,
  rateOptions
} from "../utils/Options";
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
  backdropStyle
} from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
import { Modal } from "react-overlays";
//@ts-ignore
import { Link } from "../server/routes";
import { searchPlayer } from "../graphql/queries/player/searchPlayer";
import { searchEvent } from "../graphql/queries/event/searchEvent";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import ClipCard from "../components/Clip/ClipCard";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
};

interface State {
  sort: any;
  count: Number;
  orderBy: any;
  filters: any;
  open: any;
  rating: any;
  player: any;
  event: any;
  weapon: any;
  category: any;
  map: any;
  withFilter: boolean;
  searchDisabled: boolean;
  players: [];
  playersLoading: boolean;
  events: [];
  eventsLoading: boolean;
}

let playerOptions = [];
let eventOptions = [];
let timeout: any = 0;

class Browse extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { id: "desc" },
      filters: {},
      count: 0,
      open: false,
      rating: 0,
      player: null,
      event: null,
      weapon: null,
      category: null,
      map: null,
      withFilter: false,
      searchDisabled: false,
      players: [],
      playersLoading: false,
      events: [],
      eventsLoading: false
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

  getMoreClips = (fetchMore, offset) => {
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
          this.setState({ withFilter: false, searchDisabled: true });
          return Object.assign({}, prev, {
            clip: [...fetchMoreResult.clip]
          });
        }
        console.log(prev.clip);
        console.log(fetchMoreResult.clip);

        return Object.assign({}, prev, {
          clip: [...prev.clip, ...fetchMoreResult.clip]
        });
      }
    });
  };

  searchValidation = (fetchMore, offset) => {
    if (
      this.state.category ||
      this.state.map ||
      this.state.weapon ||
      this.state.sort ||
      this.state.player ||
      this.state.event
    ) {
      this.getMoreClips(fetchMore, offset);
    } else {
      const notifyError = error => toast.warn(error);
      notifyError("Select a filter before searching");
    }
  };

  clearSearchState = () => {
    this.setState({
      player: null,
      event: null,
      weapon: null,
      category: null,
      map: null,
      sort: null,
      withFilter: true
    });
  };

  setFilters = () => {
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
    this.setState({
      filters: {
        map: { _eq: this.state.map },
        category: { _eq: this.state.category },
        weapon: { _eq: this.state.weapon },
        player: { id: { _eq: this.state.player } },
        event: { id: { _eq: this.state.event } },
        isPublic: { _eq: true }
      },
      orderBy: orderByOption
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

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  doPlayerSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    playerOptions = [];
    this.setState({ players: [], playersLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchPlayer,
        variables: {
          filters: {
            nickName: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.player.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.nickName
        };
        playerOptions.push(newOption);
      });
      console.log(data.data.player);
      if (data.data.player.length > 0) {
        //@ts-ignore
        this.setState({
          players: [...playerOptions],
          playersLoading: false,
          player: data.data.player[0].id
        });
      } else {
        //@ts-ignore
        this.setState({
          players: [],
          playersLoading: false
        });
      }
    }, 500);
  }

  doEventSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    eventOptions = [];
    this.setState({ events: [], eventsLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchEvent,
        variables: {
          filters: {
            name: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.event.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.name
        };
        eventOptions.push(newOption);
      });
      //@ts-ignore
      this.setState({
        events: [...eventOptions],
        eventsLoading: false
      });
    }, 500);
  }

  render() {
    const {
      sort,
      count,
      rating,
      category,
      map,
      weapon,
      player,
      event,
      orderBy
    } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Browse Clips" isLoggedIn={isLoggedIn}>
        <main
          style={{
            backgroundImage:
              "url(https://s3.eu-central-1.amazonaws.com/vactv/inf.jpg)",
            backgroundRepeat: "none"
          }}
        >
          <div className="freelancers sidebar">
            <div className="container">
              <Query
                query={getClipsWithFilter}
                variables={{
                  filters: { isPublic: { _eq: true } },
                  orderBy: {
                    id: "desc"
                  },
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
                        <h1>Browse</h1>
                        <div className="buttons">
                          <Select
                            menuPlacement="auto"
                            minMenuHeight={200}
                            className="sortBySelect"
                            onChange={this.handleChange("sort")}
                            value={sort ? sort.value : ""}
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
                              <div className="card-header">
                                <h5 className="mb-0">
                                  <button
                                    className="btn btn-link"
                                    type="button"
                                  >
                                    Filters
                                  </button>
                                </h5>
                              </div>
                            </div>
                            <div className="browseFilter">
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="browseSelect"
                                onChange={this.handleChange("category")}
                                value={category ? category.value : ""}
                                isSearchable={true}
                                placeholder="Filter Categories"
                                options={categoryOptions}
                              />
                            </div>
                            <div className="browseFilter">
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="browseSelect"
                                onChange={this.handleChange("map")}
                                value={map ? map.value : ""}
                                isSearchable={true}
                                placeholder="Filter Map"
                                options={mapOptions}
                              />
                            </div>
                            <div className="browseFilter">
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="browseSelect"
                                onChange={this.handleChange("weapon")}
                                value={weapon ? weapon.value : ""}
                                isSearchable={true}
                                placeholder="Filter Weapon"
                                options={weaponOptions}
                              />
                            </div>
                            <div className="browseFilter">
                              <Select
                                onInputChange={evt => this.doPlayerSearch(evt)}
                                onChange={this.handleChange("player")}
                                //@ts-ignore
                                value={player ? player.value : ""}
                                isClearable={true}
                                isLoading={this.state.playersLoading}
                                placeholder="Search for Player"
                                options={
                                  this.state.players.length > 0
                                    ? playerOptions
                                    : this.state.players
                                }
                              />
                            </div>
                            {/* <div className="browseFilter">
                              <Select
                                menuPlacement="auto"
                                minMenuHeight={200}
                                className="browseSelect"
                                value={event ? event.value : ""}
                                isSearchable={false}
                                placeholder="Filter Team"
                                options={weaponOptions}
                              />
                            </div> */}
                            <div className="browseFilter">
                              <Select
                                onInputChange={evt => this.doEventSearch(evt)}
                                onChange={this.handleChange("event")}
                                //@ts-ignore
                                value={event ? event.value : ""}
                                isClearable={true}
                                isLoading={this.state.eventsLoading}
                                placeholder="Search for Event"
                                options={
                                  this.state.events.length > 0
                                    ? eventOptions
                                    : this.state.events
                                }
                              />
                            </div>
                            <div className="clearFilter">
                              {this.state.searchDisabled ? (
                                <button
                                  onClick={() =>
                                    this.setState(
                                      {
                                        withFilter: true,
                                        searchDisabled: false
                                      },
                                      () => this.clearSearchState()
                                    )
                                  }
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Clear Filters
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    this.setState(
                                      {
                                        withFilter: true
                                      },
                                      () => this.searchValidation(fetchMore, 0)
                                    )
                                  }
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Search
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <section>
                            <div className="row">
                              {data.clip.map(clip => (
                                <ClipCard
                                  key={clip.id}
                                  specificStyle={"col-md-4"}
                                  props={this.props}
                                  clip={clip}
                                  rating={rating}
                                  onClick={this.onOpenModal.bind(this, clip.id)}
                                  handleChange={this.handleChange("rating")}
                                  showModal={!!this.state.open[clip.id]}
                                  closeModal={this.onCloseModal}
                                  renderBackdrop={this.renderBackdrop}
                                />
                              ))}
                            </div>
                            {data.clip.length < 12 ? null : data.clip.length ===
                              count ? null : (
                              <div className="load-more">
                                <a
                                  //@ts-ignore
                                  onClick={() =>
                                    this.getMoreClips(
                                      fetchMore,
                                      data.clip.length
                                    )
                                  }
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

export default defaultPage(Browse);
