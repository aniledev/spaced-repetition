import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import config from "../../config";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import WordList from "./WordList";
import "./DashboardRoute.css";

class DashboardRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    };
  }

  static contextType = UserContext;

  // mount component and fetch GET /api/language endpoint ung the bearer token and service
  componentDidMount() {
    return fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        Authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.context.setLanguage(res.language);
        this.context.setWords(res.words);
        this.setState({ loading: false });
      })
      .catch((err) => this.setState({ error: err }));
  }

  // create a function that generates the components for each of the words in the list with info using the words in context
  wordListInfo(wordsFromContext) {
    let result = [];
    wordsFromContext.forEach((word, key) =>
      result.push(<WordList key={key} word={word} />)
    );
    return <ul className="unordered-list">{result}</ul>;
  }

  render() {
    return (
      <section className="dashboard-route">
        <h2 className="dashboard-header">
          {this.context.language ? this.context.language.name : null}
        </h2>
        <p className="correct">
          Total correct answers:{" "}
          {this.context.language ? this.context.language.total_score : null}
        </p>
        <h3 className="dashboard-subtitle">Words to Practice</h3>
        <div className="words-to-practice">
          {this.context.words ? this.wordListInfo(this.context.words) : null}
        </div>
        <Link to="/learn">
          <Button className="start-practicing-button">Start Practicing</Button>
        </Link>
      </section>
    );
  }
}

export default DashboardRoute;
