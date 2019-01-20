import * as React from "react";
import Layout from "../components/Layout";
import defaultPage from "../components/hocs/defaultPage";

type Props = {
  statusCode: any;
  isLoggedIn: boolean;
};

interface State {}

class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | About this Community" isLoggedIn={isLoggedIn}>
        <div className="career-single">
          <div className="container">
            <div style={{ marginBottom: "-35px" }} className="above">
              <h1>About</h1>
            </div>
            <div className="row">
              <div className="col">
                <aside>
                  <div className="slide">
                    <div className="col-md-12">
                      <section>
                        <a href="#">
                          <div className="inner active mt-5">
                            <div className="company">
                              <img src="/static/img/vac.png" alt="" />
                              <div className="info">
                                <h2>Vac.Tv Inc.</h2>
                                <span>
                                  <i className="fa fa-map-marker" /> Denmark
                                </span>
                              </div>
                            </div>
                            <div className="middle">
                              <h2>Who runs Vac.Tv</h2>
                              <p>
                                The site is run by a bunch of gamers and current
                                Computer Science students, who has a passion for
                                eSport, software development and especially
                                CS:GO.
                              </p>
                            </div>
                          </div>
                        </a>
                      </section>
                    </div>
                  </div>
                </aside>
              </div>
              <div className="col-md-7">
                <section>
                  <div className="inside">
                    <div className="top">
                      <h4>About Vac.Tv</h4>

                      <button type="button" className="btn btn-primary">
                        <i className="fa fa-comment-o" />
                        Contact Us
                      </button>
                    </div>
                    <div className="job">
                      <div className="account">
                        <div className="info">
                          <h3>Questions</h3>
                          <h2>and Answers</h2>
                        </div>
                      </div>
                      <h4>Why we build this site</h4>
                      <p>
                        Due to the rapid growth and expansion of company
                        operations, currently we are looking for a Security
                        Penetration Tester to join our DevOps team. You will
                        work closely with our DevOps team on evaluating,
                        enhancing and conducting in-depth penetration testing of
                        our internal and external services.
                      </p>
                      <h4>Our Goals:</h4>
                      <ul>
                        <li>
                          <i className="fa fa-circle-o" />
                          Create and facilitate positive relationships between
                        </li>
                        <li>
                          <i className="fa fa-circle-o" />
                          Work with affiliates to improve our program and
                        </li>
                        <li>
                          <i className="fa fa-circle-o" />
                          Use your experience and connections in the affiliate
                        </li>
                        <li>
                          <i className="fa fa-circle-o" />
                          Bring bold new ideas to our affiliate marketing
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default defaultPage(About);
