import * as React from "react";
import Layout from "../components/Layout";
import { Query } from "react-apollo";
import { mapOptions, weaponOptions, categoryOptions } from "../utils/Options";
import Select from "react-select";
import adminPage from "../components/hocs/adminPage";
import { Modal } from "react-overlays";
import { modalStyle, backdropStyle, emojiRating } from "../utils/Styles";
import { ToastContainer, toast } from "react-toastify";
//@ts-ignore
import { Link } from "../server/routes";
import { getNotPublishedClips } from "../graphql/queries/clips/getUnverifiedClips";
import { UPDATE_CLIP_MUTATION } from "../graphql/mutations/clips/updateClipById";
import { DENY_CLIP } from "../graphql/mutations/clips/denyClip";

type Props = {
  isLoggedIn: boolean;
  client: any;
  loggedInUser: any;
};

interface State {
  open: any;
  weapon: string;
  category: any;
  map: string;
  fieldsToUpdate: any;
  submitDisable: boolean;
}

class Moderator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      weapon: "",
      category: "",
      map: "",
      fieldsToUpdate: { isPublic: true },
      submitDisable: false
    };
  }

  componentDidMount() {}

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

  handleSelectChange = name => value => {
    if (!value) {
      return;
    }

    this.setState(
      //@ts-ignore
      {
        [name]: value.value
      },
      () => this.setSelected()
    );
  };

  setSelected = () => {
    var withObjs;
    var mapObj;
    var categoryObj;
    var weaponObj;

    if (this.state.map) {
      mapObj = { map: this.state.map };
    }
    if (this.state.category) {
      categoryObj = { category: this.state.category };
    }
    if (this.state.weapon) {
      weaponObj = { weapon: this.state.weapon };
    }
    withObjs = { isPublic: true, ...mapObj, ...categoryObj, ...weaponObj };
    this.setState({ fieldsToUpdate: withObjs });
  };

  renderBackdrop(props) {
    return <div {...props} style={backdropStyle} />;
  }

  approveClip = async clipId => {
    const notifySuccess = () => toast.success("🎬 Clip Approved!");
    this.setState({ submitDisable: true });
    try {
      const data = await this.props.client.mutate({
        mutation: UPDATE_CLIP_MUTATION,
        variables: {
          id: clipId,
          set: this.state.fieldsToUpdate
        },
        update: (cache, { data: {} }) => {
          const data = cache.readQuery({ query: getNotPublishedClips });
          console.log(data);
          data.clip = data.clip.filter(t => {
            return t.id !== clipId;
          });
          cache.writeQuery({
            query: getNotPublishedClips,
            data
          });
        }
      });
      console.log(data);

      if (data.data.update_clip) {
        notifySuccess();
        this.setState({ submitDisable: false });
        this.onCloseModal();
      } else {
        console.log("Something went wrong");
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  denyClip = async clipId => {
    const notifySuccess = () => toast.success("🎬 Clip Denied!");
    this.setState({ submitDisable: true });
    try {
      const data = await this.props.client.mutate({
        mutation: DENY_CLIP,
        variables: {
          id: clipId
        },
        update: (cache, { data: {} }) => {
          const data = cache.readQuery({ query: getNotPublishedClips });
          console.log(data);
          data.clip = data.clip.filter(t => {
            return t.id !== clipId;
          });
          cache.writeQuery({
            query: getNotPublishedClips,
            data
          });
        }
      });
      console.log(data);

      if (data.data.delete_clip) {
        notifySuccess();
        this.setState({ submitDisable: false });
        this.onCloseModal();
      } else {
        console.log("Something went wrong");
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  render() {
    const { isLoggedIn } = this.props;
    const { map, weapon, category } = this.state;
    return (
      <Layout title="Vac.Tv | Moderator" isLoggedIn={isLoggedIn}>
        <main>
          <div style={{ paddingTop: "30px" }} className="freelancers sidebar">
            <div className="container">
              <Query query={getNotPublishedClips}>
                {({ loading, error, data }) => {
                  if (loading)
                    return (
                      <i
                        className="fa fa-circle-o-notch fa-spin"
                        style={{ fontSize: "24px" }}
                      />
                    );
                  if (error) return `Error!: ${error}`;
                  return (
                    <>
                      <div className="above">
                        <h1
                          style={{
                            marginBottom: "24px",
                            textTransform: "capitalize"
                          }}
                        >
                          Approve Clips
                        </h1>
                      </div>

                      <section>
                        <div className="row">
                          {data.clip.map(clip => (
                            <div key={clip.id} className="col-md-3">
                              <div className="inside">
                                <a
                                  onClick={this.onOpenModal.bind(this, clip.id)}
                                  href="#"
                                >
                                  <img
                                    className="card-img-top"
                                    src={clip.thumbNail}
                                    alt={clip.url}
                                  />
                                </a>
                                <a
                                  onClick={this.onOpenModal.bind(this, clip.id)}
                                  href="#"
                                  className="play"
                                />
                                <div className="middle">
                                  <div>
                                    <h3 style={{ textTransform: "capitalize" }}>
                                      <Link route="clip" id={clip.id}>
                                        <a>
                                          {clip.category}{" "}
                                          {emojiRating(
                                            clip.ratings_aggregate.aggregate.avg
                                              .rating
                                          )}
                                        </a>
                                      </Link>
                                    </h3>
                                    <h6
                                      style={{
                                        textTransform: "capitalize",
                                        fontSize: "12px"
                                      }}
                                    >
                                      🌍 {clip.map} | 💢{" "}
                                      <span
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {clip.weapon}
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                                <div className="bottom">
                                  <Link route="player" id={clip.player.id}>
                                    <a>
                                      <img
                                        src={
                                          clip.player === null
                                            ? ""
                                            : clip.player.image
                                        }
                                        alt={
                                          clip.player === null
                                            ? ""
                                            : clip.player.nickName
                                        }
                                      />
                                      <span>
                                        {clip.player === null
                                          ? ""
                                          : clip.player.nickName}
                                      </span>
                                    </a>
                                  </Link>
                                  <div
                                    style={{
                                      width: "32px",
                                      display: "inline-block",
                                      float: "right"
                                    }}
                                  >
                                    <a
                                      onClick={this.onOpenModal.bind(
                                        this,
                                        clip.id
                                      )}
                                      href="#"
                                    >
                                      <button className="reviewButton">
                                        Review
                                      </button>
                                    </a>
                                  </div>
                                </div>
                              </div>

                              <Modal
                                onHide={this.onCloseModal}
                                style={modalStyle()}
                                aria-labelledby="modal-label"
                                show={!!this.state.open[clip.id]}
                                renderBackdrop={this.renderBackdrop}
                              >
                                <div
                                  style={{
                                    paddingBottom: "20px",
                                    paddingTop: "20px",
                                    backgroundColor: "#fafafa",
                                    borderRadius: "5px"
                                  }}
                                >
                                  <div>
                                    <h4
                                      style={{
                                        marginLeft: "15px",
                                        marginBottom: "18px",
                                        textTransform: "capitalize",
                                        fontSize: "16px"
                                      }}
                                    >
                                      🎬{" "}
                                      {clip.category +
                                        " on " +
                                        clip.map +
                                        " with a " +
                                        clip.weapon}
                                    </h4>
                                  </div>
                                  <div className="embed-responsive embed-responsive-16by9">
                                    <iframe
                                      className="embed-responsive-item"
                                      frameBorder="false"
                                      src={clip.url}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      marginRight: "10px",
                                      height: "28px"
                                    }}
                                  >
                                    <Link route="player" id={clip.player.id}>
                                      <a>
                                        <img
                                          className="modalPlayerImg"
                                          src={
                                            clip.player === null
                                              ? ""
                                              : clip.player.image
                                          }
                                          alt={
                                            clip.player === null
                                              ? ""
                                              : clip.player.nickName
                                          }
                                        />
                                        <span className="modalPlayerImgText">
                                          {clip.player === null
                                            ? ""
                                            : clip.player.nickName}
                                        </span>
                                      </a>
                                    </Link>
                                    <button
                                      disabled={this.state.submitDisable}
                                      onClick={() => this.denyClip(clip.id)}
                                      className="denyButton"
                                    >
                                      Deny
                                    </button>
                                    <button
                                      disabled={this.state.submitDisable}
                                      onClick={() => this.approveClip(clip.id)}
                                      className="approveButton"
                                    >
                                      Approve
                                    </button>

                                    <Select
                                      menuPlacement="top"
                                      onChange={this.handleSelectChange("map")}
                                      //@ts-ignore
                                      value={map.value}
                                      className="reviewSelects"
                                      placeholder="Edit Map"
                                      options={mapOptions}
                                    />
                                    <Select
                                      menuPlacement="top"
                                      onChange={this.handleSelectChange(
                                        "weapon"
                                      )}
                                      //@ts-ignore
                                      value={weapon.value}
                                      className="reviewSelects"
                                      placeholder="Edit Weapon"
                                      options={weaponOptions}
                                    />
                                    <Select
                                      menuPlacement="top"
                                      onChange={this.handleSelectChange(
                                        "category"
                                      )}
                                      //@ts-ignore
                                      className="reviewSelects"
                                      value={category.value}
                                      placeholder={"Edit Category"}
                                      options={categoryOptions}
                                    />
                                  </div>
                                </div>
                              </Modal>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  );
                }}
              </Query>
            </div>
          </div>
        </main>
        <ToastContainer />
      </Layout>
    );
  }
}

export default adminPage(Moderator);
