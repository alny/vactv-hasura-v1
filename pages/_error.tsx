import * as React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import defaultPage from "../components/hocs/defaultPage";
type Props = {
  statusCode: any;
  isLoggedIn: boolean;
};

interface State {}

class Error extends React.Component<Props, State> {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Error" isLoggedIn={isLoggedIn}>
        <main>
          <section>
            <div className="error">
              <div className="container">
                <h1>Oops!</h1>
                <h2>They can't all be winners. Try again.</h2>
                <Link href="/">
                  <a className="btn btn-primary">Go Back</a>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}

export default defaultPage(Error);
