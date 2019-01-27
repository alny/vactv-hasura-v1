import * as React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import defaultPage from "../components/hocs/defaultPage";

type Props = {
  isLoggedIn: boolean;
};

interface State {}

class Choose extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Choose Add" isLoggedIn={isLoggedIn}>
        <main>
          <section>
            <div style={{ marginTop: "-40px" }} className="sign second">
              <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
                Choose type to Add
              </h2>

              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-4 col-md-6">
                    <div className="inside mb-0">
                      <h5>Pro Clip</h5>
                      <p>Only add clips by Pro Players</p>
                      <Link href="/addpro">
                        <a className="btn btn-primary">Get Started</a>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="inside">
                      <h5>User Clip</h5>
                      <p>Only clips by you</p>
                      <Link href="/adduser">
                        <a className="btn btn-primary">Get Started</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  style={{ marginTop: "20px" }}
                  className="row justify-content-center"
                >
                  <div className="col-lg-4 col-md-6">
                    <div className="inside mb-0">
                      <h5>Highlights/Fragmovies</h5>
                      <p>Only clips with Pro Players</p>
                      <a href="#" className="btn btn-primary">
                        Get Started
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="inside">
                      <h5>Tutorials/Guides</h5>
                      <p>Only clips showing CS:GO related</p>
                      <a href="#" className="btn btn-primary">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}

export default defaultPage(Choose);
