import * as React from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import { toFixed, circleStyle } from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
//@ts-ignore
import { Link } from "../server/routes";
import { fetchTopPlayers } from "../graphql/queries/player/topPlayers";
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
  withFilter: boolean;
  searchDisabled: boolean;
  players: any;
  playerLength: any;
  loading: boolean;
}

class TopPlayers extends React.Component<Props, State> {
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
      withFilter: false,
      searchDisabled: false,
      players: [],
      playerLength: 0,
      loading: true
    };
  }

  getMoreClips = async () => {
    const data = await this.props.client.query({
      query: fetchTopPlayers,
      variables: {
        orderBy: this.state.orderBy,
        offset: this.state.playerLength,
        limit: 12
      }
    });

    this.setState(prev => ({
      players: [...prev.players, ...data.data.player],
      playerLength: prev.playerLength + data.data.player.length
    }));
  };

  async componentDidMount() {
    console.log(this.props);
    const data = await this.props.client.query({
      query: fetchTopPlayers,
      variables: {
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 12
      }
    });
    console.log(data.data.player);
    this.setState({
      loading: false,
      players: data.data.player,
      playerLength: data.data.player.length
    });
  }

  render() {
    const { players, loading } = this.state;
    const { isLoggedIn } = this.props;

    return (
      <Layout title="Vac.Tv | Top Pro Players" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>Top Pro Players </h1>
              </div>
              <InfiniteScroll
                dataLength={players.length}
                next={() => this.getMoreClips()}
                style={{ overflow: "visible" }}
                hasMore={true}
                loading={<div>Loading</div>}
              >
                <div className="row">
                  {loading ? (
                    <div className="clipLoader" />
                  ) : (
                    players.map((player, i) => (
                      <div key={player.id} className="col-md-3">
                        <span className="totalPlayerClips"># {i + 1}</span>
                        <div className="inside">
                          <Link route="player" id={player.id}>
                            <a>
                              <img
                                className="card-img-top"
                                src={player.image}
                                alt={player.image}
                              />
                            </a>
                          </Link>

                          <div className="middle">
                            <div>
                              <h3>
                                <Link route="player" id={player.id}>
                                  <a>{player.nickName}</a>
                                </Link>
                              </h3>
                              <h6
                                style={{
                                  textTransform: "capitalize",
                                  fontSize: "12px"
                                }}
                              >
                                {player.name}
                              </h6>
                            </div>
                          </div>
                          <div className="bottom">
                            <Link route="team" id={player.team.id}>
                              <a>
                                <img
                                  src={player.team.image}
                                  alt={player.team.name}
                                />
                                <span>{player.team.name}</span>
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
                                    player.rating_aggregate.aggregate.avg.rating
                                  ) * 10
                                }
                                text={toFixed(
                                  player.rating_aggregate.aggregate.avg.rating
                                )}
                                styles={circleStyle(
                                  player.rating_aggregate.aggregate.avg.rating
                                )}
                              />
                            </div>
                          </div>
                        </div>
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

export default defaultPage(TopPlayers);
