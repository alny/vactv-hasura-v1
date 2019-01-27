import * as React from "react";
import Link from "next/link";
import Router from "next/router";
import { login, logout } from "../Auth/auth0";
import { deleteToken } from "../Auth/auth";
import defaultPage from "../../components/hocs/defaultPage";

type Props = {
  isLoggedIn: boolean;
  loggedInUser: any;
  role: any;
};

interface State {
  name: string;
  image: string;
}

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "Loading",
      image: ""
    };
  }

  componentDidMount() {
    console.log(this.props);
    var user: any = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.setState({
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
    const { isLoggedIn, loggedInUser, role } = this.props;
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
                  src="/static/img/vac.png"
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
                        padding: "5px 5px",
                        borderRadius: "100px",
                        color: "#32364f",
                        background: "white",
                        border: "2px solid #313245",
                        boxShadow: "none"
                      }}
                      className="btn btn-lg btn-primary btn-block"
                      type="submit"
                    >
                      Join/Login{" "}
                      <i
                        style={{
                          position: "relative",
                          top: "2px",
                          left: "5px",
                          fontSize: "18px"
                        }}
                        className="fa fa-sign-in"
                      />
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
                        <img src={this.state.image} alt={this.state.name} />
                        <span className="d-none d-lg-inline-flex">
                          {this.state.name}
                        </span>
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
                              <i className="fa fa-youtube" />
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
                  <Link href="/discover">
                    <a className="nav-link">
                      Discover <i className="fa fa-compass" />
                    </a>
                  </Link>
                </li>
                <li className={this.isActive("/browse")}>
                  <div className="dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Browse <i className="fa fa-crosshairs" />
                    </a>
                    <div
                      style={{ left: "10%" }}
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <div className="middle">
                        <Link href="/browse">
                          <a className="dropdown-item">Clips</a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">Highlights</a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">Tutorials</a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">Fragmovies</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className={this.isActive("/charts")}>
                  <Link href="/chart">
                    <a className="nav-link">
                      Charts <i className="fa fa-line-chart" />
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
                            right: "3px",
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
                          <a className="dropdown-item">Top Contributors</a>
                        </Link>
                        <Link href="/about">
                          <a className="dropdown-item">About</a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">FAQ</a>
                        </Link>
                        <Link href="/soon">
                          <a className="dropdown-item">Support</a>
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
