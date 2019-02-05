import * as React from "react";
import Layout from "../components/Layout";
import { Query } from "react-apollo";
import defaultPage from "../components/hocs/defaultPage";
import CircularProgressbar from "react-circular-progressbar";
import { backdropStyle, circleStyle, toFixed } from "../utils/Styles";
import { ToastContainer } from "react-toastify";
import { FRONT_PAGE } from "../graphql/queries/event/getEventOptions";
//@ts-ignore
import { Link } from "../server/routes";
import ClipCard from "../components/Clip/ClipCard";

type Props = {
  isLoggedIn: boolean;
  loggedInUser: any;
  role: String;
};

interface State {
  open: any;
  rating: Number;
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      rating: 0
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

  handleChange = name => value => {
    //@ts-ignore
    this.setState({
      [name]: value.value
    });
    console.log(this.state);
  };

  componentDidMount() {
    console.log(this.props);
  }

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  render() {
    const { isLoggedIn, role, loggedInUser } = this.props;
    const { rating } = this.state;

    return (
      <Layout
        title="Vac.Tv | Watch & Rate CS:GO Clips"
        role={role}
        isLoggedIn={isLoggedIn}
        loggedInUser={loggedInUser}
      >
        <main
          style={{
            backgroundImage:
              "url(https://s3.eu-central-1.amazonaws.com/vactv/dd2.jpg)",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div style={{ paddingTop: "25px" }} className="freelancers sidebar">
            <Query query={FRONT_PAGE}>
              {({ loading, error, data }) => {
                console.log(data);
                if (loading) return <div className="loader" />;
                if (error) return `Error!: ${error}`;
                if (
                  typeof data.eventClips != "undefined" &&
                  data.eventClips != null &&
                  data.eventClips.length != null &&
                  data.eventClips.length > 0
                ) {
                  return (
                    <div className="container">
                      <div className="above">
                        <Link route="event" id={data.eventClips[0].id}>
                          <a>
                            <h1 style={{ marginBottom: "24px" }}>
                              {data.eventClips[0].name} 🔥
                            </h1>
                          </a>
                        </Link>
                        <div className="buttons">
                          <Link route="event" id={data.eventClips[0].id}>
                            <a>
                              🎬 Event Clips:{" "}
                              {
                                data.eventClips[0].eventClips_aggregate
                                  .aggregate.count
                              }{" "}
                            </a>
                          </Link>
                        </div>
                      </div>
                      <section>
                        <div className="row">
                          {data.eventClips[0].eventClips.map(clip => (
                            <ClipCard
                              key={clip.clip.id}
                              specificStyle={"col-md-3"}
                              props={this.props}
                              isLoggedIn={isLoggedIn}
                              clip={clip.clip}
                              rating={rating}
                              onClick={this.onOpenModal.bind(
                                this,
                                clip.clip.id
                              )}
                              handleChange={this.handleChange("rating")}
                              showModal={!!this.state.open[clip.clip.id]}
                              closeModal={this.onCloseModal}
                              renderBackdrop={this.renderBackdrop}
                            />
                          ))}
                        </div>
                        <div className="above">
                          <Link route="event" id={data.eventClips[0].id}>
                            <a>
                              <h1 style={{ marginBottom: "24px" }}>
                                Top Players 🏅
                              </h1>
                            </a>
                          </Link>
                        </div>
                        <section>
                          <div className="row">
                            {data.topPlayers.map(player => (
                              <div key={player.player.id} className="col-md-3">
                                <span className="totalPlayerClips">
                                  Clips:{" "}
                                  {
                                    player.player.playerClips_aggregate
                                      .aggregate.count
                                  }
                                </span>
                                <div className="inside">
                                  <Link route="player" id={player.player.id}>
                                    <a>
                                      <img
                                        className="card-img-top"
                                        src={player.player.image}
                                        alt={player.player.image}
                                      />
                                    </a>
                                  </Link>

                                  <div className="middle">
                                    <div>
                                      <h3>
                                        <Link
                                          route="player"
                                          id={player.player.id}
                                        >
                                          <a>{player.player.nickName}</a>
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
                                    <Link
                                      route="team"
                                      id={player.player.team.id}
                                    >
                                      <a>
                                        <img
                                          src={player.player.team.image}
                                          alt={player.player.team.name}
                                        />
                                        <span>{player.player.team.name}</span>
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
                                            player.player.rating_aggregate
                                              .aggregate.avg.rating
                                          ) * 10
                                        }
                                        text={toFixed(
                                          player.player.rating_aggregate
                                            .aggregate.avg.rating
                                        )}
                                        styles={circleStyle(
                                          player.player.rating_aggregate
                                            .aggregate.avg.rating
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </section>
                    </div>
                  );
                } else {
                  return "No Data, come back later";
                }
              }}
            </Query>
            {/* <div className="career-single">
              <div className="container">
                <div className="col-md-12">
                  <section>
                    <div className="inside">
                      <div className="top">
                        <h2 style={{ marginBottom: "0px", marginLeft: "44%" }}>
                          How To
                        </h2>
                      </div>
                      <div style={{ textAlign: "center" }} className="job">
                        <img src="/static/img/logo_dark.png" />
                        <h4>1. Join the community</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                        <h4>2. Watch and Rate Clips</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                        <h4>3. Add and Share Clips</h4>
                        <p>Due to the rapid growth and expansion of company</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div> */}
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default defaultPage(Home);
