import * as React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import defaultPage from "../components/hocs/defaultPage";
type Props = {
  statusCode: any;
  isLoggedIn: boolean;
};

interface State {}

class Soon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Layout title="Vac.Tv | Coming Soon" isLoggedIn={isLoggedIn}>
        <main>
          <section>
            <div className="error">
              <div className="container">
                <h1>Coming Soon!</h1>
                <h2>This page is being build as you read this.</h2>
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

export default defaultPage(Soon);
