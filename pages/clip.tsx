import * as React from "react";
import Layout from "../components/Layout";
import { getTokenForBrowser, getTokenForServer } from "../components/Auth/auth";
import Router, { withRouter } from "next/router";
import { Query, Mutation } from "react-apollo";
import { getSingleClip } from "../graphql/queries/clips/getSingleClip";
import CircularProgressbar from "react-circular-progressbar";
import { toFixed, circleStyle } from "../utils/Styles";
import { rateOptions } from "../utils/Options";
import { RATE_CLIP_MUTATION } from "../graphql/mutations/clips/rateClipMutation";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
//@ts-ignore
import { Link } from "../server/routes";
import { isValid } from "../utils/SharedFunctions/isUUIDValid";

type Props = {
  statusCode: any;
  isLoggedIn: any;
  loggedInUser: any;
  router: any;
};

interface State {
  rating: any;
}

let isLoggedIn;
let clipId;
let userId;

class Clip extends React.Component<Props, State> {
  static async getInitialProps({ req, query }) {
    const loggedInUser = (process as any).browser
      ? await getTokenForBrowser()
      : await getTokenForServer(req);

    isLoggedIn = !!loggedInUser;
    userId = isLoggedIn ? loggedInUser.sub : "";
    clipId = query.id;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      rating: 0
    };
  }

  componentDidMount() {
    if (!isValid(this.props.router.query.id)) {
      Router.push("/");
    }
  }

  handleChange = name => value => {
    //@ts-ignore
    this.setState({
      [name]: value.value
    });
  };

  submitRate = async rateClip => {
    const notifySuccess = () => toast.success("😄 Rating submitted!");
    const notifyError = () => toast.error("🤔 Already rated!");

    if (this.state.rating) {
      try {
        const { data } = await rateClip();
        console.log(data);

        if (data.insert_rating) {
          notifySuccess();
        } else {
          notifyError();
          console.log("Already rated");
        }
      } catch (error) {
        notifyError();
        console.log(error);
        return;
      }
    }
  };

  render() {
    const {
      router: { query }
    } = this.props;
    const { rating } = this.state;
    return (
      <Layout title="Vac.Tv | Clip" isLoggedIn={isLoggedIn}>
        <main>
          <section>
            <div className="freelancer">
              <div className="container">
                <div className="above">
                  <h1>Clip</h1>
                  <div className="buttons">
                    <a href="#">
                      Share Clip <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
                <Query
                  query={getSingleClip}
                  variables={{
                    clipId: !clipId ? query.id : clipId
                  }}
                >
                  {({ loading, error, data }) => {
                    if (loading) return <div className="loader" />;
                    if (error) return `No Clip!`;
                    if (
                      typeof data.clip != "undefined" &&
                      data.clip != null &&
                      data.clip.length != null &&
                      data.clip.length > 0
                    ) {
                      return (
                        <div style={{ marginTop: "25px" }} className="inside">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="account">
                                <div className="user">
                                  <Link
                                    route="player"
                                    id={
                                      data.clip[0].players[0] === undefined
                                        ? ""
                                        : data.clip[0].players[0].player.id
                                    }
                                  >
                                    <a>
                                      <img
                                        style={{ borderRadius: "50%" }}
                                        className="mr-3"
                                        src={
                                          data.clip[0].players[0] === undefined
                                            ? "https://s3.eu-central-1.amazonaws.com/vactv/vacPlaceholder.jpg"
                                            : data.clip[0].players[0].player
                                                .image
                                        }
                                        alt="#"
                                      />
                                    </a>
                                  </Link>
                                  <div className="item mr-auto">
                                    <span>
                                      <Link
                                        route="player"
                                        id={
                                          data.clip[0].players[0] === undefined
                                            ? ""
                                            : data.clip[0].players[0].player.id
                                        }
                                      >
                                        <a>
                                          {data.clip[0].players[0] === undefined
                                            ? ""
                                            : data.clip[0].players[0].player
                                                .nickName}
                                        </a>
                                      </Link>
                                    </span>
                                    <div className="star-rating">
                                      {data.clip[0].players[0] === undefined
                                        ? ""
                                        : data.clip[0].players[0].player.name}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      width: "64px",
                                      display: "inline-block",
                                      float: "right"
                                    }}
                                  >
                                    <CircularProgressbar
                                      percentage={
                                        toFixed(
                                          data.clip[0].ratings_aggregate
                                            .aggregate.avg.rating
                                        ) * 10
                                      }
                                      text={toFixed(
                                        data.clip[0].ratings_aggregate.aggregate
                                          .avg.rating
                                      )}
                                      styles={circleStyle(
                                        data.clip[0].ratings_aggregate.aggregate
                                          .avg.rating
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="info">
                                  <h1
                                    style={{
                                      display: "block"
                                    }}
                                  >
                                    {data.clip[0].category}
                                  </h1>
                                  <h4
                                    style={{
                                      textTransform: "capitalize",
                                      display: "inline-block",
                                      fontSize: "16px",
                                      marginTop: "10px",
                                      marginBottom: "30px"
                                    }}
                                  >
                                    🌍 {data.clip[0].map} | 💢{" "}
                                    <span
                                      style={{
                                        textTransform: "uppercase"
                                      }}
                                    >
                                      {data.clip[0].weapon}
                                    </span>
                                  </h4>
                                  <h2>Event</h2>
                                  <p>
                                    {data.clip[0].events[0] === undefined
                                      ? ""
                                      : data.clip[0].events[0].event.name}
                                  </p>
                                  <h2>Total votes:</h2>
                                  <p>
                                    {
                                      data.clip[0].ratings_aggregate.aggregate
                                        .count
                                    }
                                  </p>
                                  {!isLoggedIn ? null : (
                                    <Mutation
                                      mutation={RATE_CLIP_MUTATION}
                                      variables={{
                                        userId: !isLoggedIn ? null : userId,
                                        rating,
                                        objects: [
                                          {
                                            rating,
                                            userId: !isLoggedIn ? null : userId,
                                            clipId: data.clip[0].id,
                                            playerId:
                                              data.clip[0].players[0] ===
                                              undefined
                                                ? ""
                                                : data.clip[0].players[0].player
                                                    .id,
                                            teamId:
                                              data.clip[0].players[0] ===
                                              undefined
                                                ? ""
                                                : data.clip[0].players[0].player
                                                    .teamId,
                                            eventId:
                                              data.clip[0].events[0] ===
                                              undefined
                                                ? ""
                                                : data.clip[0].events[0].event
                                                    .id
                                          }
                                        ]
                                      }}
                                    >
                                      {(rateClip, {}) => (
                                        <Select
                                          menuPlacement="top"
                                          minMenuHeight={200}
                                          //@ts-ignore
                                          onChange={this.handleChange("rating")}
                                          onMenuClose={() =>
                                            this.submitRate(rateClip)
                                          }
                                          className="rateSelectorSingle"
                                          placeholder="Rate 😆"
                                          options={rateOptions}
                                        />
                                      )}
                                    </Mutation>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="embed-responsive embed-responsive-4by3">
                                <iframe
                                  className="embed-responsive-item"
                                  frameBorder="false"
                                  src={data.clip[0].url}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return "No Clip Found";
                    }
                  }}
                </Query>
              </div>
            </div>
          </section>
          <ToastContainer />
        </main>
      </Layout>
    );
  }
}

export default withRouter(Clip);
