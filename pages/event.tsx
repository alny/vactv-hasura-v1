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
import InfiniteScroll from "react-infinite-scroll-component";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import { getSingleEventClips } from "../graphql/queries/event/getSingleEvent";
import { submitRate } from "../utils/SharedFunctions/submitRating";
import ClipCard from "../components/Clip/ClipCard";

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
  eventProfile: any;
  clipLength: any;
  loading: any;
}

let isLoggedIn;
let userId;
let eventId;

class Event extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : "";
    eventId = query.id;
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
      eventProfile: {},
      loading: true
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
      query: getSingleEventClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    this.setState({
      clips: [...this.state.clips, ...data.data.event[0].clips],
      clipLength: this.state.clipLength + data.data.event[0].clips.length
    });
  };

  setFilters = async () => {
    let orderByOption;
    this.setState({ clipLength: 0 });
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
      query: getSingleEventClips,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: orderByOption,
        limit: 12
      }
    });
    this.setState({
      orderBy: orderByOption,
      clips: [...data.data.event[0].clips],
      clipLength: data.data.event[0].clips.length
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
      query: getSingleEventClips,
      variables: {
        filters: {
          id: { _eq: !eventId ? this.props.router.query.id : eventId }
        },
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    console.log(data.data.event[0]);
    this.setState({
      loading: false,
      clips: data.data.event[0].clips,
      clipLength: data.data.event[0].clips.length,
      eventProfile: {
        id: data.data.event[0].id,
        name: data.data.event[0].name,
        image: data.data.event[0].image,
        clipCount: data.data.event[0].clips_aggregate.aggregate.count
      }
    });
    console.log(isLoggedIn);
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { eventProfile, rating, loading } = this.state;
    return (
      <Layout title="Vac.Tv | Pro Player" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>{eventProfile ? eventProfile.name : null} 🔥</h1>
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
                            src={eventProfile ? eventProfile.image : null}
                            alt=""
                          />
                        </a>
                        <div className="item mr-auto">
                          <div className="star-rating">
                            {eventProfile ? eventProfile.name : null}
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

                        <span className="totalRating">
                          {" "}
                          {eventProfile ? eventProfile.clipCount : null}
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
                      hasMore={eventProfile.clipCount !== this.state.clipLength}
                      loading={<div>Loading</div>}
                    >
                      <div className="row">
                        {loading ? (
                          <div className="clipLoader" />
                        ) : (
                          this.state.clips.map(clip => (
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

export default withRouter(Event);
