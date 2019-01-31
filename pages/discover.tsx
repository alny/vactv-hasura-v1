import * as React from "react";
import Layout from "../components/Layout";
import { Query } from "react-apollo";
import { getClipsWithFilter } from "../graphql/queries/clips/getClipsWithFilter";
import { sortOptions } from "../utils/Options";
import Select from "react-select";
import defaultPage from "../components/hocs/defaultPage";
import { backdropStyle } from "../utils/Styles";
import { ToastContainer } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import ClipCard from "../components/Clip/ClipCard";

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

  filters = fetchMore => {
    this.setState({ sort: "latest" });
    //@ts-ignore
    var startDay = moment().startOf("day");
    var endDay = moment().endOf("day");

    if (this.state.sort === "today") {
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
            id: "desc"
          },
          filters: {
            _and: [
              { createdAt: { _gte: startDay.toISOString() } },
              { createdAt: { _lte: endDay.toISOString() } },
              { isPublic: { _eq: true } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
    if (this.state.sort === "week") {
      var currentDate = moment();
      //@ts-ignore
      var weekStart = currentDate.clone().startOf("isoweek");
      //@ts-ignore
      var weekEnd = currentDate.clone().endOf("isoweek");
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
            id: "desc"
          },
          filters: {
            _and: [
              { createdAt: { _gte: weekStart.toISOString() } },
              { createdAt: { _lte: weekEnd.toISOString() } },
              { isPublic: { _eq: true } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
    if (this.state.sort === "month") {
      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");
      this.setState(
        {
          orderBy: {
            ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
            id: "desc"
          },
          filters: {
            _and: [
              { createdAt: { _gte: startOfMonth } },
              { createdAt: { _lte: endOfMonth } },
              { isPublic: { _eq: true } }
            ]
          },
          withFilter: true
        },
        () => this.getMoreClips(fetchMore, 0)
      );
    }
  };

  handleSelectChange = (name, fetchMore) => value => {
    event.preventDefault();
    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      },
      () => this.filters(fetchMore)
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

  render() {
    const { sort, orderBy, rating } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Discover Clips" isLoggedIn={isLoggedIn}>
        <main
          style={{
            backgroundImage:
              "url(https://s3.eu-central-1.amazonaws.com/vactv/train2.jpg)"
          }}
        >
          <div style={{ paddingTop: "25px" }} className="freelancers sidebar">
            <div className="container">
              <Query
                query={getClipsWithFilter}
                variables={{
                  filters: { isPublic: { _eq: true } },
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
                  if (!data.clip) return `No Clips!`;

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
                              fetchMore
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
                              <ClipCard
                                key={clip.id}
                                specificStyle={"col-md-3"}
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
