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
  CREATE_EVENT_ON_CLIP_MUTATION,
  CREATE_PRO_CLIP_MUTATION
} from "../graphql/mutations/clips/createClipMutation";
import { validationSchema } from "../utils/Yup/Schemas";
import { searchTeam } from "../graphql/queries/team/searchTeam";

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
  teamLoading: boolean;
  teams: [];
  team: any;
  submitDisable: boolean;
  clipType: any;
  platform: String;
  isChecked: boolean;
}

let playerOptions = [];
let eventOptions = [];
let teamOptions = [];
let timeout: any = 0;

class Add extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      player: "",
      event: "",
      team: "",
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
      teams: [],
      teamLoading: false,
      submitDisable: false,
      platform: "",
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
    this.setState({
      isChecked: !this.state.isChecked,
      event: "",
      platform: ""
    });
  }

  handleSelectChange = name => value => {
    if (!value) {
      return;
    }
    if (name === "clipType") {
      //@ts-ignore
      this.setState({
        [name]: value.value,
        platform: "",
        player: "",
        team: "",
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
    const notifyError = error => toast.warn("😋 " + error);

    let options = clipTypeGen(this.state, this.props);

    await validationSchema(this.state)
      .validate(this.state)
      .then(async () => {
        this.setState({ submitDisable: true });
        try {
          console.log(this.state);
          const clip = await this.props.client.mutate({
            mutation: CREATE_PRO_CLIP_MUTATION,
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
            this.setState({ submitDisable: true });
            notifySuccess();
            setTimeout(() => Router.replace("/"), 3000);
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
    }, 1500);
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
    }, 1500);
  }

  doTeamSearch(evt) {
    var searchText = evt; // this is the search text
    if (timeout) clearTimeout(timeout);
    if (!evt) {
      return;
    }
    teamOptions = [];
    this.setState({ teams: [], teamLoading: true });
    timeout = setTimeout(async () => {
      console.log(searchText);
      const data = await this.props.client.query({
        query: searchTeam,
        variables: {
          filters: {
            name: { _ilike: "%" + searchText + "%" }
          }
        }
      });
      await data.data.team.forEach(element => {
        var newOption = {
          value: element.id,
          label: element.name
        };
        teamOptions.push(newOption);
      });
      //@ts-ignore
      this.setState({
        teams: [...teamOptions],
        teamLoading: false
      });
    }, 1500);
  }

  render() {
    const { isLoggedIn, loggedInUser } = this.props;
    const {
      category,
      player,
      map,
      weapon,
      event,
      team,
      url,
      platform,
      clipType,
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
                      {clipType === "tutorial" ? (
                        <div style={{ marginBottom: "15px" }}>
                          <Select
                            className="addSelect"
                            onChange={this.handleSelectChange("category")}
                            //@ts-ignore
                            value={category ? category.value : ""}
                            placeholder={"Select Tutorial Type..."}
                            options={tutorialType}
                          />
                        </div>
                      ) : null}
                      {clipType === "fragmovie" ||
                      clipType === "highlight" ||
                      clipType === "" ? null : (
                        <>
                          <Select
                            className="addSelect-Left"
                            onChange={this.handleSelectChange("map")}
                            //@ts-ignore
                            value={map ? map.value : ""}
                            placeholder="Select A Map..."
                            options={mapOptions}
                          />
                          {category === "weapon" ||
                          clipType === "pro" ||
                          clipType === "user" ||
                          category === "aim" ||
                          category === "flash" ||
                          category === "other" ||
                          category === "tricks" ||
                          category === "spray control" ||
                          category === "smoke" ? (
                            <Select
                              className="addSelect-Right"
                              onChange={this.handleSelectChange("weapon")}
                              //@ts-ignore
                              value={weapon ? weapon.value : ""}
                              placeholder="Select A Weapon..."
                              options={weaponOptions}
                            />
                          ) : null}
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
                        <>
                          <Select
                            className="addSelect"
                            onChange={this.handleSelectChange("category")}
                            //@ts-ignore
                            value={category ? category.value : ""}
                            placeholder={"Select A Type..."}
                            options={fragmovieType}
                          />
                        </>
                      ) : null}
                    </div>
                    {clipType === "pro" ||
                    category === "player" ||
                    category === "event" ? (
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
                          isDisabled={isChecked}
                          isLoading={this.state.eventsLoading}
                          placeholder="Search for Event e.g. 'Blast Pro'"
                          options={
                            this.state.events.length > 0
                              ? eventOptions
                              : this.state.events
                          }
                        />{" "}
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
                    {category === "team" ? (
                      <Select
                        className="addSelect-Left"
                        onInputChange={evt => this.doTeamSearch(evt)}
                        onChange={this.handleSelectChange("team")}
                        //@ts-ignore
                        value={team ? team.value : ""}
                        isClearable={true}
                        isLoading={this.state.teamLoading}
                        placeholder="Search for Team e.g. 'Astralis'"
                        options={
                          this.state.teams.length > 0
                            ? teamOptions
                            : this.state.teams
                        }
                      />
                    ) : null}
                    {clipType === "user" ? (
                      <Select
                        className="addSelect"
                        onChange={this.handleSelectChange("platform")}
                        //@ts-ignore
                        value={platform ? platform.value : ""}
                        placeholder={"Select A Platform..."}
                        options={clipPlatform}
                      />
                    ) : null}
                    {clipType === "tutorial" ||
                    category === "player" ||
                    category === "team" ? (
                      <br />
                    ) : null}
                    <button
                      style={{
                        marginTop: "50px",
                        width: "100%",
                        maxWidth: "100%"
                      }}
                      className="btn btn-lg btn-primary btn-block"
                      type="submit"
                      onClick={e => this.handleSubmit(e)}
                      disabled={this.state.submitDisable}
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
