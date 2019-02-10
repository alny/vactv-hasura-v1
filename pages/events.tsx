import * as React from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import { toFixed, circleStyle } from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
//@ts-ignore
import { Link } from "../server/routes";
import { getAllEvents } from "../graphql/queries/event/getAllEvents";
import defaultPage from "../components/hocs/defaultPage";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
  router: any;
};

interface State {
  sort: any;
  orderBy: any;
  filters: any;
  searchDisabled: boolean;
  events: any;
  eventLength: any;
  loading: boolean;
}

class Events extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: {
        id: "desc",
        rating_aggregate: {
          avg: { rating: "desc_nulls_last" },
          count: "desc_nulls_last"
        }
      },
      filters: {},
      searchDisabled: false,
      events: [],
      eventLength: 0,
      loading: true
    };
  }

  getMoreClips = async () => {
    const data = await this.props.client.query({
      query: getAllEvents,
      variables: {
        orderBy: this.state.orderBy,
        offset: this.state.eventLength,
        limit: 12
      }
    });

    this.setState(prev => ({
      events: [...prev.events, ...data.data.event],
      eventLength: prev.eventLength + data.data.event.length
    }));
  };

  async componentDidMount() {
    console.log(this.props);
    const data = await this.props.client.query({
      query: getAllEvents,
      variables: {
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    console.log(data.data.player);
    this.setState({
      loading: false,
      events: data.data.event,
      eventLength: data.data.event.length
    });
  }

  render() {
    const { events, loading } = this.state;
    const { isLoggedIn } = this.props;

    return (
      <Layout title="Vac.Tv | Recent CS:GO Events" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>CS:GO Events </h1>
              </div>
              <InfiniteScroll
                dataLength={events.length}
                next={() => this.getMoreClips()}
                style={{ overflow: "visible" }}
                hasMore={true}
                loading={<div>Loading</div>}
              >
                <div className="row">
                  {loading ? (
                    <div className="clipLoader" />
                  ) : (
                    events.map((event, i) => (
                      <div key={event.id} className="col-md-4">
                        <Link route="event" id={event.id}>
                          <a>
                            <div className="inside">
                              <div
                                style={{ borderBottom: "1px solid #f6f5f9" }}
                                className="bottom"
                              >
                                <img src={event.image} alt={event.nickName} />
                                <span className="cut-text-2">{event.name}</span>

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
                                        event.rating_aggregate.aggregate.avg
                                          .rating
                                      ) * 10
                                    }
                                    text={toFixed(
                                      event.rating_aggregate.aggregate.avg
                                        .rating
                                    )}
                                    styles={circleStyle(
                                      event.rating_aggregate.aggregate.avg
                                        .rating
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="middle">
                                <h6
                                  style={{
                                    textTransform: "capitalize",
                                    fontSize: "12px",
                                    fontWeight: 600
                                  }}
                                >
                                  <span>Organizer: {event.organizer}</span>
                                </h6>
                                <h6
                                  style={{
                                    textTransform: "capitalize",
                                    fontSize: "12px",
                                    marginTop: "20px",
                                    fontWeight: 800
                                  }}
                                >
                                  {event.type}
                                  <span
                                    style={{
                                      float: "right"
                                    }}
                                  >
                                    {" "}
                                    Clips:{" "}
                                    {event.eventClips_aggregate.aggregate.count}
                                  </span>
                                </h6>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default defaultPage(Events);
