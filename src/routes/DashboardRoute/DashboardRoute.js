import React, { Component } from "react";
import { Link } from "react-router-dom";

class DashboardRoute extends Component {
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
