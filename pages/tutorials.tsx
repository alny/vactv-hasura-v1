import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import {
  sortMoreOptions,
  mapOptions,
  categoryOptions,
  weaponOptions,
  tutorialType
} from "../utils/Options";
import defaultPage from "../components/hocs/defaultPage";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
import { Query } from "react-apollo";
import { getOtherClipsWithFilter } from "../graphql/queries/clips/getOtherClips";
import { backdropStyle } from "../utils/Styles";
//@ts-ignore
import { searchPlayer } from "../graphql/queries/player/searchPlayer";
import { searchEvent } from "../graphql/queries/event/searchEvent";
import OtherClipCard from "../components/Clip/OtherClipCard";

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
  weapon: any;
  category: any;
  map: any;
  withFilter: boolean;
  searchDisabled: boolean;
}

let timeout: any = 0;

class Tutorials extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { id: "desc" },
      filters: { type: { _eq: "Tutorial" } },
      count: 0,
      open: false,
      rating: 0,
      weapon: null,
      category: null,
      map: null,
      withFilter: false,
      searchDisabled: false
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
    console.log("More Clip");
    fetchMore({
      variables: {
        offset,
        orderBy: this.state.orderBy,
        filters: this.state.filters
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.otherClip) return prev;
        this.setState({
          count: offset
        });
        console.log(fetchMoreResult.otherClip);
        if (this.state.withFilter) {
          this.setState({ withFilter: false, searchDisabled: true });

          return Object.assign({}, prev, {
            otherClip: [...fetchMoreResult.otherClip]
          });
        }
        console.log(prev.otherClip);
        console.log(fetchMoreResult.otherClip);

        return Object.assign({}, prev, {
          otherClip: [...prev.otherClip, ...fetchMoreResult.otherClip]
        });
      }
    });
  };

  searchValidation = (fetchMore, offset) => {
    if (
      this.state.category ||
      this.state.map ||
      this.state.weapon ||
      this.state.sort
    ) {
      this.getMoreClips(fetchMore, offset);
    } else {
      const notifyError = error => toast.warn(error);
      notifyError("Select a filter before searching");
    }
  };

  clearSearchState = () => {
    this.setState({
      weapon: null,
      category: null,
      map: null,
      sort: null,
      withFilter: true
    });
  };

  setFilters = () => {
    console.log("Filter");
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
        weapon: { _eq: this.state.weapon }
        // isPublic: { _eq: true }
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

  render() {
    const { sort, count, rating, category, map, weapon, orderBy } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Tutorials" isLoggedIn={isLoggedIn}>
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
                query={getOtherClipsWithFilter}
                variables={{
                  filters: { type: { _eq: "Tutorial" } },
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
                        <h1>Tutorials</h1>
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
                                placeholder="Filter Type"
                                options={tutorialType}
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
                              {data.otherClip.map(clip => (
                                <OtherClipCard
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
                            {data.otherClip.length < 12 ? null : data.otherClip
                                .length === count ? null : (
                              <div className="load-more">
                                <a
                                  //@ts-ignore
                                  onClick={() =>
                                    this.getMoreClips(
                                      fetchMore,
                                      data.otherClip.length
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

export default defaultPage(Tutorials);
