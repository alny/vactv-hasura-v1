import * as React from "react";
import Select from "react-select";
import Layout from "../components/Layout";
import privatePage from "../components/hocs/privatePage";
import { ToastContainer, toast } from "react-toastify";
import {
  createUserClipSchema,
  createProClipSchema
} from "../utils/Yup/Schemas";
import {
  mapOptions,
  weaponOptions,
  categoryOptions,
  clipTypeOption
} from "../utils/Options";
import { Mutation } from "react-apollo";
import { CREATE_CLIP_MUTATION } from "../graphql/mutations/clips/createClipMutation";
import Router from "next/router";
import { searchPlayer } from "../graphql/queries/player/searchPlayer";
import { searchEvent } from "../graphql/queries/event/searchEvent";

type Props = {
  statusCode: any;
  isLoggedIn: boolean;
  loggedInUser: any;
  client: any;
  timeout: any;
};

interface State {
  player: any;
  event: any;
  weapon: string;
  category: string;
  map: string;
  url: string;
  title: string;
  players: [];
  playersLoading: boolean;
  events: [];
  eventsLoading: boolean;
  submitDisable: boolean;
  clipType: any;
}

let playerOptions = [];
let eventOptions = [];
let timeout: any = 0;

class Add extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      player: "",
      event: "",
      weapon: "",
      category: "",
      map: "",
      title: "",
      url: "",
      clipType: "",
      players: [],
      playersLoading: false,
      events: [],
      eventsLoading: false,
      submitDisable: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    //@ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelectChange = name => value => {
    if (!value) {
      return;
    }
    //@ts-ignore
    this.setState({
      [name]: value.value
    });
  };

  handleSubmit = async (e, createClip) => {
    e.preventDefault();

    const notifySuccess = () =>
      toast.success("😄 Clip successfully submitted!");
    const notifyError = error => toast.warn(error);

    const { url, player, event, weapon, category, map } = this.state;

    this.state.clipType === "Pro Clip"
      ? await createProClipSchema
          .validate({
            url,
            player,
            event,
            weapon,
            category,
            map
          })
          .then(async () => {
            this.setState({ submitDisable: true });
            try {
              const { data } = await createClip();
              console.log(data);
              if (data.insert_clip) {
                // this.setState({ submitDisable: true });
                notifySuccess();
                // setTimeout(() => Router.replace("/"), 3000);
                return;
              }
            } catch (error) {
              console.log(error);
              return;
            }
          })
          .catch(function(err) {
            console.log(err);
            notifyError(err.message);
            return;
          })
      : "User";
  };

  doPlayerSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    playerOptions = [];
    this.setState({ players: [], playersLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchPlayer,
        variables: {
          filters: {
            nickName: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.player.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.nickName
        };
        playerOptions.push(newOption);
      });
      console.log(data.data.player);
      if (data.data.player.length > 0) {
        //@ts-ignore
        this.setState({
          players: [...playerOptions],
          playersLoading: false,
          player: data.data.player[0].id
        });
      } else {
        //@ts-ignore
        this.setState({
          players: [],
          playersLoading: false
        });
      }
    }, 500);
  }

  doEventSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    eventOptions = [];
    this.setState({ events: [], eventsLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchEvent,
        variables: {
          filters: {
            name: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.event.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.name
        };
        eventOptions.push(newOption);
      });
      //@ts-ignore
      this.setState({
        events: [...eventOptions],
        eventsLoading: false
      });
    }, 500);
  }

  render() {
    const { isLoggedIn, loggedInUser } = this.props;
    const {
      category,
      player,
      map,
      weapon,
      event,
      title,
      url,
      clipType
    } = this.state;
    return (
      <Layout title="Vac.Tv | Add Clip" isLoggedIn={isLoggedIn}>
        <main>
          <section>
            <div className="sign">
              <div className="container">
                <form className="form-sign">
                  <div style={{ marginBottom: "25px" }} className="text-left">
                    <h1 className="h3">Add Clip</h1>
                    <h6 style={{ marginBottom: "15px" }}>
                      Providers Supported:
                    </h6>
                    <i
                      style={{
                        fontSize: "34px",
                        color: "red",
                        marginRight: "15px"
                      }}
                      className="fa fa-youtube"
                    />
                    <i
                      style={{
                        fontSize: "34px",
                        color: "#1da1f2",
                        marginRight: "15px"
                      }}
                      className="fa fa-twitter"
                    />
                    <i
                      style={{
                        fontSize: "34px",
                        color: "#6441a4",
                        marginRight: "15px"
                      }}
                      className="fa fa-twitch"
                    />
                    <img
                      style={{ width: "38px", marginTop: "-18px" }}
                      src="https://about.plays.tv/wp-content/uploads/2018/03/logo-mark-300x300.png"
                    />
                  </div>
                  <Mutation
                    mutation={CREATE_CLIP_MUTATION}
                    variables={{
                      objects: [
                        {
                          url,
                          title,
                          playerId: player,
                          eventId: event,
                          userId: loggedInUser.sub,
                          weapon,
                          category,
                          map
                        }
                      ]
                    }}
                  >
                    {(createClip, {}) => (
                      <>
                        <div className="form-row">
                          <div className="col">
                            <div className="form-label-group">
                              <Select
                                className="addSelect"
                                onChange={this.handleSelectChange("clipType")}
                                //@ts-ignore
                                value={clipType.value}
                                placeholder={"Select Clip Type..."}
                                options={clipTypeOption}
                              />
                            </div>
                            <div className="form-label-group">
                              <input
                                style={{ height: "calc(4.25rem + 2px)" }}
                                type="text"
                                id="inputFirst"
                                className="form-control"
                                name="url"
                                onChange={this.handleChange}
                                value={url}
                                placeholder="Copy/Paste Link"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-label-group">
                          <Select
                            className="addSelect-Left"
                            onChange={this.handleSelectChange("map")}
                            //@ts-ignore
                            value={map.value}
                            placeholder="Select A Map..."
                            options={mapOptions}
                          />
                          <Select
                            className="addSelect-Right"
                            onChange={this.handleSelectChange("weapon")}
                            //@ts-ignore
                            value={weapon.value}
                            placeholder="Select A Weapon..."
                            options={weaponOptions}
                          />
                          <Select
                            className="addSelect"
                            onChange={this.handleSelectChange("category")}
                            //@ts-ignore
                            value={category.value}
                            placeholder={"Select A Category..."}
                            options={categoryOptions}
                          />
                        </div>
                        {clipType === "Pro Clip" ? (
                          <div className="form-label-group">
                            <Select
                              className="addSelect-Left"
                              onInputChange={evt => this.doPlayerSearch(evt)}
                              onChange={this.handleSelectChange("player")}
                              //@ts-ignore
                              value={player.value}
                              isClearable={true}
                              isLoading={this.state.playersLoading}
                              placeholder="Search for Player e.g. 'device'"
                              options={
                                this.state.players.length > 0
                                  ? playerOptions
                                  : this.state.players
                              }
                            />
                            <Select
                              className="addSelect-Right"
                              onInputChange={evt => this.doEventSearch(evt)}
                              onChange={this.handleSelectChange("event")}
                              //@ts-ignore
                              value={event.value}
                              isClearable={true}
                              isLoading={this.state.eventsLoading}
                              placeholder="Search for Event e.g. 'Blast Pro'"
                              options={
                                this.state.events.length > 0
                                  ? eventOptions
                                  : this.state.events
                              }
                            />
                          </div>
                        ) : null}

                        <button
                          style={{
                            marginTop:
                              clipType === "Pro Clip" ? "80px" : "40px",
                            width: "100%",
                            maxWidth: "100%"
                          }}
                          className="btn btn-lg btn-primary btn-block"
                          type="submit"
                          onClick={e => this.handleSubmit(e, createClip)}
                          // disabled={this.state.submitDisable}
                        >
                          Submit Clip
                        </button>
                      </>
                    )}
                  </Mutation>
                </form>
              </div>
            </div>
          </section>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default privatePage(Add);
