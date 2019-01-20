import React, { Component } from "react";
import privatePage from "../components/hocs/privatePage";

class Secret extends Component {
  render() {
    return (
      <div>
        <h2>Secret Page</h2>
      </div>
    );
  }
}

export default privatePage(Secret);
