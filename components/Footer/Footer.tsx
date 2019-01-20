import * as React from "react";
type Props = {};

interface State {}

class Footer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer>
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-lg-pull-6 col-xs-12">
                <p>© Copyright 2019 Vac.Tv, All Rights Reserved</p>
              </div>
              <div className="col-lg-5 col-lg-push-6 col-xs-12">
                <ul>
                  <li>
                    <a href="#">
                      <span>Terms of Service</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span>Privacy Policy</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
