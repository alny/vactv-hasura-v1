import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import {
  sortMoreOptions,
  mapOptions,
  categoryOptions,
  weaponOptions,
  clipTypeOption
} from "../utils/Options";
import defaultPage from "../components/hocs/defaultPage";
import { ToastContainer, toast } from "react-toastify";
import { Query } from "react-apollo";
import { getClipsWithFilter } from "../graphql/queries/clips/getClipsWithFilter";
import { backdropStyle } from "../utils/Styles";
import { searchPlayer } from "../graphql/queries/player/searchPlayer";
import { searchEvent } from "../graphql/queries/event/searchEvent";
import ClipCard from "../components/Clip/ClipCard";
import { searchTeam } from "../graphql/queries/team/searchTeam";

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
  team: any;
  event: any;
  weapon: any;
  category: any;
  map: any;
  withFilter: boolean;
  searchDisabled: boolean;
  players: [];
  playersLoading: boolean;
  events: [];
  teamLoading: boolean;
  teams: [];
  eventsLoading: boolean;
  type: any;
}

let playerOptions = [];
let eventOptions = [];
let teamOptions = [];
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
      team: null,
      event: null,
      weapon: null,
      category: null,
      map: null,
      withFilter: false,
      searchDisabled: false,
      players: [],
      playersLoading: false,
      events: [],
      eventsLoading: false,
      teams: [],
      teamLoading: false,
      type: null
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
      this.state.team ||
      this.state.event ||
      this.state.type
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
      team: null,
      event: null,
      weapon: null,
      category: null,
      type: null,
      map: null,
      sort: null,
      withFilter: true
    });
  };

  setFilters = () => {
    let orderByOption;
    let filterOption: any = {
      isPublic: { _eq: true }
    };

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
    if (this.state.type) {
      filterOption = { type: { _eq: this.state.type }, ...filterOption };
    }
    if (this.state.map) {
      filterOption = { map: { _eq: this.state.map }, ...filterOption };
    }
    if (this.state.category) {
      filterOption = {
        category: { _eq: this.state.category },
        ...filterOption
      };
    }
    if (this.state.weapon) {
      filterOption = { weapon: { _eq: this.state.weapon }, ...filterOption };
    }
    if (this.state.player) {
      filterOption = {
        players: { player: { id: { _eq: this.state.player } } },
        ...filterOption
      };
    }
    if (this.state.team) {
      filterOption = {
        players: { player: { teamId: { _eq: this.state.team } } },
        ...filterOption
      };
    }
    if (this.state.event) {
      filterOption = {
        events: { event: { id: { _eq: this.state.event } } },
        ...filterOption
      };
    }
    this.setState({
      filters: filterOption,
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
    }, 1000);
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
    }, 1000);
  }
  doTeamSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    teamOptions = [];
    this.setState({ teams: [], teamLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchTeam,
        variables: {
          filters: {
            name: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.team.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.name
        };
        teamOptions.push(newOption);
      });
      //@ts-ignore
      this.setState({
        teams: [...teamOptions],
        teamLoading: false
      });
    }, 1000);
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
      type,
      team
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
                                onChange={this.handleChange("type")}
                                value={type ? type.value : ""}
                                isSearchable={false}
                                placeholder="Filter Type"
                                options={clipTypeOption}
                              />
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
                            <div className="browseFilter">
                              <Select
                                onInputChange={evt => this.doTeamSearch(evt)}
                                onChange={this.handleChange("team")}
                                value={team ? team.value : ""}
                                isClearable={true}
                                isLoading={this.state.teamLoading}
                                placeholder="Search for Team"
                                options={
                                  this.state.teams.length > 0
                                    ? teamOptions
                                    : this.state.teams
                                }
                              />
                            </div>
                            <div className="browseFilter">
                              <Select
                                onInputChange={evt => this.doEventSearch(evt)}
                                onChange={this.handleChange("event")}
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
                                  isLoggedIn={isLoggedIn}
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
