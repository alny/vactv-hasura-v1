import * as React from "react";
import Layout from "../components/Layout";
import { Query } from "react-apollo";
import { getClipsWithFilter } from "../graphql/queries/clips/getClipsWithFilter";
import { sortOptions } from "../utils/Options";
import Select from "react-select";
import defaultPage from "../components/hocs/defaultPage";
import { backdropStyle } from "../utils/Styles";
import { ToastContainer } from "react-toastify";
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
  clips: any;
  clipLength: any;
  loading: boolean;
  isEmpty: boolean;
}

class Discover extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: "latest",
      orderBy: {
        createdAt: "desc_nulls_last",
        id: "desc"
      },
      filters: { isPublic: { _eq: true } },
      open: false,
      rating: 0,
      withFilter: false,
      clips: [],
      clipLength: 0,
      loading: true,
      isEmpty: false
    };
  }

  async componentDidMount() {
    const data = await this.props.client.query({
      query: getClipsWithFilter,
      variables: {
        filters: { isPublic: { _eq: true } },
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    console.log(data);
    this.setState({
      loading: false,
      clips: data.data.clip,
      clipLength: data.data.clip.length
    });
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
      query: getClipsWithFilter,
      variables: {
        filters: this.state.filters,
        offset: this.state.clipLength,
        orderBy: this.state.orderBy,
        limit: 12
      }
    });
    if (data.data.clip.length != 0) {
      this.setState({
        clips: [...this.state.clips, ...data.data.clip],
        clipLength: this.state.clipLength + data.data.clip.length
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }
  };

  filters = async () => {
    let orderByOption;
    let filterOption;
    var startDay = moment().startOf("day");
    var endDay = moment().endOf("day");

    if (this.state.sort === "today") {
      (orderByOption = {
        ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
        id: "desc"
      }),
        (filterOption = {
          _and: [
            { createdAt: { _gte: startDay.toISOString() } },
            { createdAt: { _lte: endDay.toISOString() } },
            { isPublic: { _eq: true } }
          ]
        });
    }
    if (this.state.sort === "week") {
      var currentDate = moment();
      //@ts-ignore
      var weekStart = currentDate.clone().startOf("isoweek");
      //@ts-ignore
      var weekEnd = currentDate.clone().endOf("isoweek");
      (orderByOption = {
        ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
        id: "desc"
      }),
        (filterOption = {
          _and: [
            { createdAt: { _gte: weekStart.toISOString() } },
            { createdAt: { _lte: weekEnd.toISOString() } },
            { isPublic: { _eq: true } }
          ]
        });
    }
    if (this.state.sort === "month") {
      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");
      (orderByOption = {
        ratings_aggregate: { avg: { rating: "desc_nulls_last" } },
        id: "desc"
      }),
        (filterOption = {
          _and: [
            { createdAt: { _gte: startOfMonth } },
            { createdAt: { _lte: endOfMonth } },
            { isPublic: { _eq: true } }
          ]
        });
    }
    const data = await this.props.client.query({
      query: getClipsWithFilter,
      variables: {
        filters: filterOption,
        orderBy: orderByOption,
        offset: this.state.clipLength,
        limit: 12
      }
    });

    this.setState({
      orderBy: orderByOption,
      filters: filterOption,
      clips: [...data.data.clip],
      clipLength: data.data.clip.length
    });
  };

  handleSelectChange = name => value => {
    event.preventDefault();
    this.setState(
      //@ts-ignore
      {
        [name]: value.value,
        clipLength: 0
      },
      () => this.filters()
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
    const { sort, clips, rating, loading, isEmpty } = this.state;
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
                      onChange={this.handleSelectChange("sort")}
                      menuPlacement="auto"
                      minMenuHeight={200}
                      className="sortBySelect"
                      value={sort.value}
                      isSearchable={false}
                      placeholder="Sort By"
                      options={sortOptions}
                    />
                  </div>
                </div>

                <section>
                  <div className="row">
                    {loading ? (
                      <div className="clipLoader" />
                    ) : (
                      clips.map(clip => (
                        <ClipCard
                          key={clip.id}
                          specificStyle={"col-md-3"}
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
                </section>
              </>
              {isEmpty ? null : (
                <div className="load-more">
                  <a
                    onClick={() => this.getMoreClips()}
                    className="btn btn-primary"
                    rel="next"
                  >
                    Load More
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default defaultPage(Discover);
