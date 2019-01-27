import * as React from "react";
import Head from "next/head";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

type Props = {
  title?: string;
  isLoggedIn: boolean;
  role?: String;
  loggedInUser?: any;
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

          <link rel="icon" href="/static/img/favicon_v1.png" />
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
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(a,b,c){var d=a.history,e=document,f=navigator||{},g=localStorage,
              h=encodeURIComponent,i=d.pushState,k=function(){return Math.random().toString(36)},
              l=function(){return g.cid||(g.cid=k()),g.cid},m=function(r){var s=[];for(var t in r)
              r.hasOwnProperty(t)&&void 0!==r[t]&&s.push(h(t)+"="+h(r[t]));return s.join("&")},
              n=function(r,s,t,u,v,w,x){var z="https://www.google-analytics.com/collect",
              A=m({v:"1",ds:"web",aip:c.anonymizeIp?1:void 0,tid:b,cid:l(),t:r||"pageview",
              sd:c.colorDepth&&screen.colorDepth?screen.colorDepth+"-bits":void 0,dr:e.referrer||
              void 0,dt:e.title,dl:e.location.origin+e.location.pathname+e.location.search,ul:c.language?
              (f.language||"").toLowerCase():void 0,de:c.characterSet?e.characterSet:void 0,
              sr:c.screenSize?(a.screen||{}).width+"x"+(a.screen||{}).height:void 0,vp:c.screenSize&&
              a.visualViewport?(a.visualViewport||{}).width+"x"+(a.visualViewport||{}).height:void 0,
              ec:s||void 0,ea:t||void 0,el:u||void 0,ev:v||void 0,exd:w||void 0,exf:"undefined"!=typeof x&&
              !1==!!x?0:void 0});if(f.sendBeacon)f.sendBeacon(z,A);else{var y=new XMLHttpRequest;
              y.open("POST",z,!0),y.send(A)}};d.pushState=function(r){return"function"==typeof d.onpushstate&&
              d.onpushstate({state:r}),setTimeout(n,c.delay||10),i.apply(d,arguments)},n(),
              a.ma={trackEvent:function o(r,s,t,u){return n("event",r,s,t,u)},
              trackException:function q(r,s){return n("exception",null,null,null,null,r,s)}}})
              (window,"UA-132930902-1",{anonymizeIp:true,colorDepth:true,characterSet:true,screenSize:true,language:true});`
            }}
          />
        </Head>
        <Navbar {...this.props} />
        {children}
        <Footer />
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" />
        <script src="/static/js/popper.min.js" />
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-132930902-1"
        />
      </div>
    );
  }
}

export default Layout;
