import * as React from "react";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";
import { toFixed, circleStyle } from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
//@ts-ignore
import { Link } from "../server/routes";
import { getAllPlayers } from "../graphql/queries/player/getAllPlayers";
import defaultPage from "../components/hocs/defaultPage";

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
  players: any;
  playerLength: any;
  loading: boolean;
  isEmpty: boolean;
}

class Players extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: {
        nickName: "asc"
      },
      filters: {},
      searchDisabled: false,
      players: [],
      playerLength: 0,
      loading: true,
      isEmpty: false
    };
  }

  getMoreClips = async () => {
    const data = await this.props.client.query({
      query: getAllPlayers,
      variables: {
        orderBy: this.state.orderBy,
        offset: this.state.playerLength,
        limit: 12
      }
    });
    if (data.data.player && data.data.player.length) {
      this.setState(prev => ({
        players: [...prev.players, ...data.data.player],
        playerLength: prev.playerLength + data.data.player.length
      }));
    } else {
      this.setState({
        isEmpty: true
      });
    }
  };

  async componentDidMount() {
    console.log(this.props);
    const data = await this.props.client.query({
      query: getAllPlayers,
      variables: {
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 24
      }
    });
    this.setState({
      loading: false,
      players: data.data.player,
      playerLength: data.data.player.length
    });
  }

  render() {
    const { players, loading, isEmpty } = this.state;
    const { isLoggedIn } = this.props;

    return (
      <Layout title="Vac.Tv | CS:GO Pro Players" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>CS:GO Pro Players </h1>
              </div>
              <div className="row">
                {loading ? (
                  <div className="clipLoader" />
                ) : (
                  players.map((player, i) => (
                    <div key={player.id} className="col-md-3">
                      <Link route="player" id={player.id}>
                        <a>
                          <div className="inside">
                            <div
                              style={{ borderBottom: "1px solid #f6f5f9" }}
                              className="bottom"
                            >
                              <img src={player.image} alt={player.nickName} />
                              <span>{player.nickName}</span>

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
                                      player.rating_aggregate.aggregate.avg
                                        .rating
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
                            <div className="middle">
                              <h6
                                style={{
                                  textTransform: "capitalize",
                                  fontSize: "12px",
                                  fontWeight: 600
                                }}
                              >
                                <img
                                  style={{
                                    width: "32px",
                                    marginLeft: "-6px",
                                    marginRight: "8px"
                                  }}
                                  src={player.team.image}
                                  alt={player.team.name}
                                />

                                {player.team.name}
                                <span
                                  style={{ float: "right", marginTop: "10px" }}
                                >
                                  {" "}
                                  Clips:{" "}
                                  {player.clips_aggregate.aggregate.count}
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

export default defaultPage(Players);
