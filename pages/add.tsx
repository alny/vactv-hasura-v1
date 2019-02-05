import * as React from "react";
import Select from "react-select";
import Layout from "../components/Layout";
import privatePage from "../components/hocs/privatePage";
import { ToastContainer, toast } from "react-toastify";

import {
  mapOptions,
  weaponOptions,
  categoryOptions,
  clipTypeOption,
  clipPlatform,
  tutorialType,
  fragmovieType
} from "../utils/Options";

import Router from "next/router";
import { searchPlayer } from "../graphql/queries/player/searchPlayer";
import { searchEvent } from "../graphql/queries/event/searchEvent";
import { clipTypeGen } from "../utils/SharedFunctions/clipType";
import {
  CREATE_PLAYER_ON_CLIP_MUTATION,
  CREATE_EVENT_ON_CLIP_MUTATION
} from "../graphql/mutations/clips/createClipMutation";

type Props = {
  statusCode: any;
  isLoggedIn: boolean;
  loggedInUser: any;
  client: any;
  timeout: any;
  isChecked: boolean;
};

interface State {
  player: any;
  event: any;
  weapon: string;
  category: string;
  map: string;
  url: string;
  title: string;
  players: any;
  playersLoading: boolean;
  events: [];
  eventsLoading: boolean;
  submitDisable: boolean;
  clipType: any;
  platform: String;
  otherType: String;
  isChecked: boolean;
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
      submitDisable: false,
      platform: "",
      otherType: "",
      isChecked: props.isChecked || false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  handleChange(e) {
    //@ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckBoxChange() {
    this.setState({ isChecked: !this.state.isChecked, event: null });
  }

  handleSelectChange = name => value => {
    if (!value) {
      return;
    }
    if (name === "clipType") {
      console.log(name);
      //@ts-ignore
      this.setState({
        [name]: value.value,
        platform: "",
        otherType: "",
        player: "",
        event: "",
        weapon: "",
        category: "",
        map: "",
        title: ""
      });
    } else {
      //@ts-ignore
      this.setState({
        [name]: value.value
      });
    }
  };

  componentDidMount() {
    console.log(this.props);
  }

  handleSubmit = async e => {
    e.preventDefault();
    if (!this.state.clipType) {
      return;
    }

    const notifySuccess = () =>
      toast.success("😄 Clip successfully submitted!");
    const notifyError = error => toast.warn(error);

    let options = clipTypeGen(this.state, this.props);
    if (!options.validator) {
      return;
    }
    await options.validator
      .validate(options.validateData)
      .then(async () => {
        this.setState({ submitDisable: true });
        try {
          console.log(this.state);
          const clip = await this.props.client.mutate({
            mutation: options.mutation,
            variables: {
              objects: [options.variables]
            }
          });
          console.log(clip);

          if (this.state.player && clip.data.insert_clip) {
            const player = await this.props.client.mutate({
              mutation: CREATE_PLAYER_ON_CLIP_MUTATION,
              variables: {
                objects: [
                  {
                    clipId: clip.data.insert_clip.returning[0].id,
                    playerId: this.state.player
                  }
                ]
              }
            });
            console.log(player);
          }

          if (this.state.event && clip.data.insert_clip) {
            const event = await this.props.client.mutate({
              mutation: CREATE_EVENT_ON_CLIP_MUTATION,
              variables: {
                objects: [
                  {
                    clipId: clip.data.insert_clip.returning[0].id,
                    eventId: this.state.event
                  }
                ]
              }
            });
            console.log(event);
          }

          if (clip.data.insert_clip) {
            // this.setState({ submitDisable: true });
            notifySuccess();
            // setTimeout(() => Router.replace("/"), 3000);
            return;
          }
        } catch (error) {
          notifyError(error.message);
          console.log(error);
          return;
        }
      })
      .catch(function(err) {
        console.log(err);
        notifyError(err.message);
        return;
      });
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
      if (data.data.player.length > 0) {
        this.setState({
          players: [...playerOptions],
          playersLoading: false,
          player: data.data.player[0].id
        });
      } else {
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
      platform,
      clipType,
      otherType,
      isChecked
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
                      className="fab fa-youtube"
                    />
                    <i
                      style={{
                        fontSize: "34px",
                        color: "#1da1f2",
                        marginRight: "15px"
                      }}
                      className="fab fa-twitter"
                    />
                    <i
                      style={{
                        fontSize: "34px",
                        color: "#6441a4",
                        marginRight: "15px"
                      }}
                      className="fab fa-twitch"
                    />
                    <img
                      style={{ width: "38px", marginTop: "-18px" }}
                      src="https://about.plays.tv/wp-content/uploads/2018/03/logo-mark-300x300.png"
                    />
                  </div>
                  <>
                    <div className="form-row">
                      <div className="col">
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
                      </div>
                    </div>
                    <div className="form-label-group">
                      {clipType === "Fragmovie" ||
                      clipType === "Highlight" ? null : (
                        <>
                          <Select
                            className="addSelect-Left"
                            onChange={this.handleSelectChange("map")}
                            //@ts-ignore
                            value={map ? map.value : ""}
                            placeholder="Select A Map..."
                            options={mapOptions}
                          />
                          <Select
                            className="addSelect-Right"
                            onChange={this.handleSelectChange("weapon")}
                            //@ts-ignore
                            value={weapon ? weapon.value : ""}
                            placeholder="Select A Weapon..."
                            options={weaponOptions}
                          />
                        </>
                      )}

                      {clipType === "user" || clipType === "pro" ? (
                        <Select
                          className="addSelect"
                          onChange={this.handleSelectChange("category")}
                          //@ts-ignore
                          value={category ? category.value : ""}
                          placeholder={"Select A Category..."}
                          options={categoryOptions}
                        />
                      ) : null}
                      {clipType === "fragmovie" || clipType === "highlight" ? (
                        <Select
                          className="addSelect"
                          onChange={this.handleSelectChange("otherType")}
                          //@ts-ignore
                          value={otherType ? otherType.value : ""}
                          placeholder={"Select A Type..."}
                          options={fragmovieType}
                        />
                      ) : null}
                      {clipType === "tutorial" ? (
                        <Select
                          className="addSelect"
                          onChange={this.handleSelectChange("otherType")}
                          //@ts-ignore
                          value={otherType ? otherType.value : ""}
                          placeholder={"Select Tutorial Type..."}
                          options={tutorialType}
                        />
                      ) : null}
                    </div>
                    {clipType === "pro" ||
                    clipType === "highlight" ||
                    clipType === "fragmovie" ? (
                      <div className="form-label-group">
                        <Select
                          className="addSelect-Left"
                          onInputChange={evt => this.doPlayerSearch(evt)}
                          onChange={this.handleSelectChange("player")}
                          //@ts-ignore
                          value={player ? player.value : ""}
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
                          value={event ? event.value : ""}
                          isClearable={true}
                          isLoading={this.state.eventsLoading}
                          placeholder="Search for Event e.g. 'Blast Pro'"
                          options={
                            this.state.events.length > 0
                              ? eventOptions
                              : this.state.events
                          }
                        />
                        <div className="eventCheckBox">
                          <input
                            name="noEvent"
                            onChange={this.handleCheckBoxChange}
                            //@ts-ignore
                            value={this.state.isChecked}
                            type="checkbox"
                          />
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "15px",
                              marginLeft: "5px"
                            }}
                          >
                            No Event {this.state.isChecked}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {clipType === "user" || isChecked ? (
                      <Select
                        className="addSelect"
                        onChange={this.handleSelectChange("platform")}
                        //@ts-ignore
                        value={platform ? platform.value : ""}
                        placeholder={"Select A Platform..."}
                        options={clipPlatform}
                      />
                    ) : null}
                    <button
                      style={{
                        marginTop: "80px",
                        width: "100%",
                        maxWidth: "100%"
                      }}
                      className="btn btn-lg btn-primary btn-block"
                      type="submit"
                      onClick={e => this.handleSubmit(e)}
                      // disabled={this.state.submitDisable}
                    >
                      Submit Clip
                    </button>
                  </>
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
