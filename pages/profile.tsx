import * as React from "react";
import Layout from "../components/Layout";
import Select from "react-select";
import { sortMoreOptions } from "../utils/Options";
import { ToastContainer, toast } from "react-toastify";
import { backdropStyle } from "../utils/Styles";
//@ts-ignore
import { Link } from "../server/routes";
import InfiniteScroll from "react-infinite-scroll-component";
import { getUserUploads } from "../graphql/queries/user/getUserUploadClips";
import privatePage from "../components/hocs/privatePage";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import ClipCard from "../components/Clip/ClipCard";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
  router: any;
  role: string;
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
  loading: boolean;
  sum: Number;
}

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: { createdAt: "desc_nulls_last", id: "desc" },
      filters: {},
      count: 0,
      open: false,
      rating: 0,
      withFilter: false,
      searchDisabled: false,
      clips: [],
      clipLength: 0,
      loading: true,
      sum: 0
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
      query: getUserUploads,
      variables: {
        userId: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub,
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
    console.log(data.data);
    this.setState({
      clips: [...this.state.clips, ...data.data.clip],
      clipLength: this.state.clipLength + data.data.clip.length
    });
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
      query: getUserUploads,
      variables: {
        userId: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub,
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
      clips: [...data.data.clip],
      clipLength: data.data.clip.length
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
    const data = await this.props.client.query({
      query: getUserUploads,
      variables: {
        userId: !this.props.isLoggedIn ? null : this.props.loggedInUser.sub,
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
    this.setState({
      clips: data.data.clip,
      clipLength: data.data.clip.length,
      count: data.data.clip_aggregate.aggregate.count,
      sum: data.data.rating_aggregate.aggregate.sum.rating,
      loading: false
    });
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { isLoggedIn } = this.props;
    const { rating, clips, loading, sum } = this.state;
    return (
      <Layout title="Vac.Tv | Profile" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>Profile</h1>
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
                              this.props.loggedInUser.picture
                                ? this.props.loggedInUser.picture
                                : null
                            }
                            alt=""
                          />
                        </a>
                        <div className="item mr-auto">
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: 600
                            }}
                          >
                            <a href="#">
                              {this.props.loggedInUser
                                ? this.props.loggedInUser.name
                                : null}
                            </a>
                          </span>
                          <div
                            style={{ textTransform: "capitalize" }}
                            className="star-rating"
                          >
                            Role:{" "}
                            {this.props.loggedInUser ? this.props.role : null}
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
                        <span className="totalRating">{this.state.count}</span>
                      </div>
                      <div className="singlePlayer">
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginRight: "10px"
                          }}
                        >
                          Credits Earned:
                        </span>
                        <span className="totalRating">{sum}</span>
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
                      hasMore={this.state.count !== this.state.clipLength}
                      loading={<div>Loading</div>}
                    >
                      <div className="row">
                        {loading ? (
                          <div className="clipLoader" />
                        ) : (
                          clips.map(clip => (
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
                          ))
                        )}
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

export default privatePage(Profile);
