import * as React from "react";
import Layout from "../components/Layout";
import { Query, Mutation } from "react-apollo";
import defaultPage from "../components/hocs/defaultPage";
import CircularProgressbar from "react-circular-progressbar";
import Select from "react-select";
import { rateOptions } from "../utils/Options";
import { Modal } from "react-overlays";
import {
  modalStyle,
  backdropStyle,
  circleStyle,
  emojiRating,
  toFixed
} from "../utils/Styles";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import { ToastContainer, toast } from "react-toastify";
import { GET_FRONTPAGE_EVENTS } from "../graphql/queries/event/getEventOptions";
//@ts-ignore
import { Link } from "../server/routes";
import Links from "next/link";
import { submitRate } from "../utils/SharedFunctions/submitRating";
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
      //@ts-ignore
      <Layout
        title="Vac.Tv | Watch & Rate CS:GO Clips"
        role={role}
        isLoggedIn={isLoggedIn}
        loggedInUser={loggedInUser}
      >
        <main
          style={{
            backgroundImage:
              "url(https://s3.eu-central-1.amazonaws.com/vactv/dd2.jpg)"
          }}
        >
          <div style={{ paddingTop: "25px" }} className="freelancers sidebar">
            <Query query={GET_FRONTPAGE_EVENTS}>
              {({ loading, error, data }) => {
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
                        <Link route="events" id={data.eventClips[0].id}>
                          <a>
                            <h1 style={{ marginBottom: "24px" }}>
                              {data.eventClips[0].name} 🔥
                            </h1>
                          </a>
                        </Link>
                        <div className="buttons">
                          <Link route="events" id={data.eventClips[0].id}>
                            <a>
                              🎬 Event Clips:{" "}
                              {
                                data.eventClips[0].clips_aggregate.aggregate
                                  .count
                              }{" "}
                            </a>
                          </Link>
                        </div>
                      </div>
                      <section>
                        <div className="row">
                          {data.eventClips[0].clips.map(clip => (
                            <ClipCard
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
                        <div className="above">
                          <Link route="events" id={data.eventClips[0].id}>
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
                              <div key={player.id} className="col-md-3">
                                <span className="totalPlayerClips">
                                  Clips:{" "}
                                  {player.clips_aggregate.aggregate.count}
                                </span>
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
                                            player.rating_aggregate.aggregate
                                              .avg.rating
                                          ) * 10
                                        }
                                        text={toFixed(
                                          player.rating_aggregate.aggregate.avg
                                            .rating
                                        )}
                                        styles={circleStyle(
                                          player.rating_aggregate.aggregate.avg
                                            .rating
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
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default defaultPage(Home);
