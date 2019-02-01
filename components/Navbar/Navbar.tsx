import * as React from "react";
import Link from "next/link";
import Router from "next/router";
import { login, logout } from "../Auth/auth0";
import { deleteToken } from "../Auth/auth";
import defaultPage from "../../components/hocs/defaultPage";
//@ts-ignore
import { Link as Routes } from "../../server/routes";

type Props = {
  isLoggedIn: boolean;
  loggedInUser: any;
  role: any;
};

interface State {
  name: string;
  image: string;
  id: string;
}

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      name: "Loading",
      image: ""
    };
  }

  componentDidMount() {
    console.log(this.props);
    var user: any = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.setState({
        id: user.id,
        name: user.name,
        image: user.image
      });
    }
  }

  isActive = route => {
    if (Router.router != null) {
      if (Router.router.route === route) {
        return "nav-item active";
      }
    }
    return "nav-item";
  };

  logOutUser = async () => {
    await deleteToken();
    await localStorage.clear();
    await logout();
  };

  render() {
    const { isLoggedIn, role } = this.props;
    const { image, name } = this.state;

    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-light fixed-top bg-white">
          <div className="container">
            <Link href="/">
              <a className="mr-1" rel="home">
                <img
                  className="logo hidden-xs"
                  src="/static/img/t_v2.png"
                  alt="logo"
                />
                <img
                  className="logo-small visible-xs"
                  src="/static/img/t_v2.png"
                  alt="small logo"
                />
              </a>
            </Link>

            <div className="d-flex align-items-center order-md-2">
              <button
                className="navbar-toggler ml-auto"
                type="button"
                data-toggle="collapse"
                data-target="#navbarsExample07"
                aria-controls="navbarsExample07"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i
                  style={{ fontSize: "21px", color: "#adb5bd" }}
                  className="fa fa-bars"
                />
              </button>

              {!isLoggedIn ? (
                <div className="profile">
                  <a onClick={() => login()} href="#">
                    <button
                      style={{
                        padding: "4px",
                        borderRadius: "3px",
                        color: "#262b2f",
                        background: "white",
                        border: "2px solid rgba(49, 50, 69, 0.8)",
                        boxShadow: "none",
                        fontSize: "13px",
                        minWidth: "135px"
                      }}
                      className="btn btn-lg btn-primary btn-block"
                      type="submit"
                    >
                      Join/Login{" "}
                      {/* <i
                        style={{
                          position: "relative",
                          top: "1px",
                          left: "5px",
                          fontSize: "14px"
                        }}
                        className="fas fa-sign-in-alt"
                      /> */}
                    </button>
                  </a>
                </div>
              ) : (
                <>
                  <div className="profile">
                    <div className="dropdown">
                      <a
                        href="#"
                        className="profile-tab"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <img src={image} alt={name} />
                        <span className="d-none d-lg-inline-flex">{name}</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <div className="account">
                          {/* <a href="#">
                            <img src={this.state.image} alt={this.state.name} />
                          </a> */}
                          <h3>
                            <a href="#"> Level 1 | Credits: 0 </a>
                          </h3>
                        </div>
                        <div className="middle">
                          <Link href="/soon">
                            <a className="dropdown-item">
                              <i className="fa fa-user-circle" />
                              Your Profile
                            </a>
                          </Link>
                          {role === "moderator" || role === "admin" ? (
                            <Link href="/moderator">
                              <a className="dropdown-item">
                                <i className="fa fa-user-secret" />
                                Moderator
                              </a>
                            </Link>
                          ) : null}

                          <Link href="/add">
                            <a className="dropdown-item">
                              <i className="fa fa-plus" />
                              Add Clip
                            </a>
                          </Link>
                          <Link href="/uploads">
                            <a className="dropdown-item">
                              <i className="fa fa-film" />
                              Your Uploads
                            </a>
                          </Link>
                          <a
                            onClick={this.logOutUser}
                            href="#"
                            className="dropdown-item"
                          >
                            <i className="fa fa-power-off" />
                            Logout
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="collapse navbar-collapse" id="navbarsExample07">
              <ul className="navbar-nav mr-auto ad-rg">
                <li className={this.isActive("/discover")}>
                  <div className="dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Discover{" "}
                      <i
                        style={{ fontWeight: 500 }}
                        className="fa fa-compass"
                      />
                    </a>
                    <div
                      style={{ left: "10%" }}
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <div className="middle">
                        <Link href="/discover">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-play-circle"
                            />
                            Latest Clips
                          </a>
                        </Link>
                        <Link href="/events">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-globe-europe"
                            />
                            Events
                          </a>
                        </Link>
                        <Link href="/teams">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-users"
                            />
                            Teams
                          </a>
                        </Link>
                        <Link href="/players">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-user-ninja"
                            />
                            Players
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className={this.isActive("/browse")}>
                  <div className="dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Browse{" "}
                      <i
                        style={{ fontWeight: 600, fontSize: "14px" }}
                        className="fa fa-crosshairs"
                      />
                    </a>
                    <div
                      style={{ left: "10%" }}
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <div className="middle">
                        <Link href="/browse">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-play"
                            />
                            Clips
                          </a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-magic"
                            />
                            Highlights
                          </a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-graduation-cap"
                            />
                            Tutorials
                          </a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px" }}
                              className="fas fa-video"
                            />
                            Fragmovies
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className={this.isActive("/charts")}>
                  <Link href="/chart">
                    <a className="nav-link">
                      Charts{" "}
                      <i
                        style={{
                          position: "relative",
                          top: "1px",
                          left: "3px",
                          fontWeight: 600,
                          fontSize: "14px"
                        }}
                        className="fas fa-medal"
                      />
                    </a>
                  </Link>
                </li>
                <li className={this.isActive("/more")}>
                  <div className="dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      role="button"
                      data-toggle="dropdown"
                    >
                      <span className="d-none d-lg-inline-flex">
                        More{" "}
                        <i
                          style={{
                            position: "absolute",
                            right: "1px",
                            top: "13px"
                          }}
                          className="fa fa-ellipsis-h"
                        />
                      </span>
                    </a>
                    <div
                      style={{ left: "10%" }}
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <div className="middle">
                        <Link href="/soon">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px", fontSize: "16px" }}
                              className="fas fa-award"
                            />
                            Top Contributors
                          </a>
                        </Link>
                        <Link href="/about">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px", fontSize: "16px" }}
                              className="fas fa-info-circle"
                            />
                            About
                          </a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">
                            {" "}
                            <i
                              style={{ marginRight: "8px", fontSize: "16px" }}
                              className="fas fa-question-circle"
                            />
                            FAQ
                          </a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">
                            <i
                              style={{ marginRight: "8px", fontSize: "16px" }}
                              className="fas fa-life-ring"
                            />
                            Support
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="corner-ribbon top-left sticky red shadow">BETA</div>
      </header>
    );
  }
}

export default defaultPage(Navbar);
