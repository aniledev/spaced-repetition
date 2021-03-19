import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import config from "../../config";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import WordList from "./WordList";
// import { result } from "cypress/types/lodash";

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
    return <ul>{result}</ul>;
  }

  render() {
    return (
      <section>
        {/* h2 and p need to be updated with info from the server*/}
        <h2 className="dashboard-header">
          {this.context.language ? this.context.language.name : null}
        </h2>
        <p>Total correct answers: 7</p>
        <h3 className="dashboard-subtitle">Words to Practice</h3>
        <div className="words-to-practice">
          {this.context.words ? this.wordListInfo(this.context.words) : null}
        </div>
        <Link className="start-practicing-link" to="/learn">
          <Button>Start Practicing</Button>
        </Link>
      </section>
    );
  }
}

export default DashboardRoute;
