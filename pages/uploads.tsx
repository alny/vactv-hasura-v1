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
  clipLength: any;
}

class Uploads extends React.Component<Props, State> {
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
      clipLength: 0
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
      clipLength: data.data.clip.length,
      count: data.data.clip_aggregate.aggregate.count
    });
  }

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
                <h1>Uploaded by you:</h1>
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
                        <span className="totalRating">{this.state.count}</span>
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
                        {this.state.clips.map(clip => (
                          <ClipCard
                            specificStyle={"col-md-4"}
                            props={this.props}
                            clip={clip}
                            rating={rating}
                            onClick={this.onOpenModal.bind(this, clip.id)}
                            handleChange={this.handleChange("rating")}
                            showModal={!!this.state.open[clip.id]}
                            closeModal={this.onCloseModal}
                            key={clip.id}
                            renderBackdrop={this.renderBackdrop}
                          />
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
