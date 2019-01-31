import * as React from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import { toFixed, circleStyle } from "../utils/Styles";
import CircularProgressbar from "react-circular-progressbar";
//@ts-ignore
import { Link } from "../server/routes";
import { getAllTeams } from "../graphql/queries/team/getAllTeams";
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
  teams: any;
  teamLength: any;
  loading: boolean;
  isEmpty: boolean;
}

class Teams extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: null,
      orderBy: {
        name: "asc",
        id: "desc"
      },
      filters: {},
      searchDisabled: false,
      teams: [],
      teamLength: 0,
      loading: true,
      isEmpty: false
    };
  }

  getMoreClips = async () => {
    console.log("EROL");
    const data = await this.props.client.query({
      query: getAllTeams,
      variables: {
        orderBy: this.state.orderBy,
        offset: this.state.teamLength,
        limit: 12
      }
    });
    if (data.data.team && data.data.team.length) {
      this.setState(prev => ({
        teams: [...prev.teams, ...data.data.team],
        teamLength: prev.teamLength + data.data.team.length
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
      query: getAllTeams,
      variables: {
        orderBy: this.state.orderBy,
        offset: 0,
        limit: 24
      }
    });
    this.setState({
      loading: false,
      teams: data.data.team,
      teamLength: data.data.team.length
    });
  }

  render() {
    const { teams, loading, isEmpty } = this.state;
    const { isLoggedIn } = this.props;

    return (
      <Layout title="Vac.Tv | CS:GO Pro Teams" isLoggedIn={isLoggedIn}>
        <main>
          <div className="freelancers sidebar">
            <div className="container">
              <div className="above">
                <h1>CS:GO Pro Teams </h1>
              </div>
              <div className="row">
                {loading ? (
                  <div className="clipLoader" />
                ) : (
                  teams.map((team, i) => (
                    <div key={team.id} className="col-md-3">
                      <Link route="team" id={team.id}>
                        <a>
                          <div className="inside">
                            <div className="bottom">
                              <img src={team.image} alt={team.name} />
                              <span>{team.name}</span>

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
                                      team.ratings_aggregate.aggregate.avg
                                        .rating
                                    ) * 10
                                  }
                                  text={toFixed(
                                    team.ratings_aggregate.aggregate.avg.rating
                                  )}
                                  styles={circleStyle(
                                    team.ratings_aggregate.aggregate.avg.rating
                                  )}
                                />
                              </div>
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

export default defaultPage(Teams);
