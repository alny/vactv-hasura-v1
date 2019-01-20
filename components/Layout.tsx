import * as React from "react";
import Head from "next/head";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

type Props = {
  title?: string;
  isLoggedIn: boolean;
};

class Layout extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { children, title } = this.props;
    return (
      <div>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Vac.Tv - Watch & Rate CS:GO Clips! Clips, Videos, Frags, Pro Players, Pro Teams, Events, Weapons, Categories and more!"
          />
          <meta
            name="twitter:card"
            defaultValue="Vac.Tv - Watch & Rate CS:GO Clips! Clips, Videos, Frags, Pro Players, Pro Teams, Events, Weapons, Categories and more!"
          />
          <meta
            property="og:title"
            content="Vac.Tv | Watch & Rate CS:GO Clips"
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="vac.tv" />
          <meta property="og:image" content="/static/img/vac.png" />
          <meta property="og:site_name" content="Vac.Tv" />
          <meta
            property="og:description"
            content="Vac.Tv - Watch & Rate CS:GO Clips! Clips, Videos, Frags, Pro Players, Pro Teams, Events, Weapons, Categories and more!"
          />

          <link rel="icon" href="/static/img/favicon.png" />
          <link href="/static/css/ReactToastify.min.css" rel="stylesheet" />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:500,600,700"
            rel="stylesheet"
          />
          <link
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <link
            href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            rel="stylesheet"
          />
          <link href="/static/css/nprogress.css" rel="stylesheet" />
          <link href="/static/css/style.min.css" rel="stylesheet" />
          <link href="/static/css/circular.styles.css" rel="stylesheet" />
        </Head>
        <Navbar {...this.props} />
        {children}
        <Footer />
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" />
        <script src="/static/js/popper.min.js" />
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" />
      </div>
    );
  }
}

export default Layout;
