import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";

class DashboardRoute extends Component {
  // initialize state to catch errors a use that for conditional rendering of error messages
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    };
  }

  // use context for sharing data
  static contextType = UserContext;

  render() {
    return (
      <section>
        {/* h2 and p need to be updated with info from the server*/}
        <h2 className="dashboard-header">Test language 1</h2>
        <p>Total correct answers: 7</p>
        <h3>Words to Practice</h3>
        <div className="words-to-practice">
          <ul>
            <li>Word</li>
            <li>Word</li>
            <li>Word</li>
            <li>Word</li>
            <li>Word</li>
          </ul>
        </div>
        <Link className="start-practicing-link" to="/learn">
          Start Practicing
        </Link>
      </section>
    );
  }
}

export default DashboardRoute;
