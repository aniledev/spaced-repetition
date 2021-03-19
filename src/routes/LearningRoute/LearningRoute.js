import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import { Input, Required, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";

class LearningRoute extends Component {
  //initialize state to hold values for error logging and results from the serer
  constructor(props) {
    super(props);
    // bind event handler to this component
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      error: null,
      // create this.state.results to determine if the server has update with results; this can conditionally render the correct incorrect feedback text
      results: false,
      // loading: true,
    };
  }

  // go ahead and initialize UserContext
  static contextType = UserContext;

  // write method to submit the form and check the guess translation against the server/database
  handleSubmit(event) {
    event.preventDefault();
    // create a variable for the current word
    // create a variable for the guess translation
    // update the variable for the next word using state
    // when i submit the form i also need to conditionally render the feedback text on the page

    // send HTTP request to the server api/language/guess to check the guess against teh server
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${TokenService.getAuthToken()}`,
      },
      // the response body is the input value of the form
      body: JSON.stringify({ guess: event.target.guess.value }),
    });
  }

  // create GET request to api/language/head to start learning with the first word when the component mounts
  componentDidMount() {
    return (
      fetch(`${config.API_ENDPOINT}/language/head`, {
        headers: {
          Authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
        // with the response from the server, update the context with the next word response object
        .then((res) => res.json())
        .then((res) => {
          this.context.setNextWord(res);
          // this.setState({ loading: false });
        })
        .catch((err) => this.setState({ error: err }))
    );
  };

  render() {
    // eslint-disable-next-line no-lone-blocks
    {/*
     I need to conditionally render a feedback div to show whether answer was right.
     I need to conditioally render the correct answer
     I need to conditionally render the button to either be a show answer or next word button
    */}
    return (
      <section className="learn-route">
        <div className="DisplayScore">
          <p>
            Your total score is:{" "}
            {this.context.nextWord ? this.context.nextWord.totalScore : null}
          </p>
        </div>
        <h2 className="learn-route-header">Translate the word:</h2>
        <span>
          <h3>
            {this.context.nextWord ? this.context.nextWord.nextWord : null}
          </h3>
        </span>
        <div className="DisplayFeedback">
          <p>You were right/good try..</p>
          <p>The correct answer was...</p>
        </div>

        <form onSubmit={this.handleSubmit}>
          <Label htmlFor="learn-guess-input">
            What's the translation for this word?
            <Required />
          </Label>
          <Input
            className="learn-guess-input"
            ref={this.firstInput}
            id="learn-guess-input"
            name="guess"
            type="text"
            placeholder="translation"
            maxLength="20"
            autofocus={true}
            required
          />
          <Button className="guess-word-button" type="submit">
            Submit Answer
          </Button>
        </form>
        <p className="word-count-stats">
          You have answered this word correctly{" "}
          {this.context.nextWord ? this.context.nextWord.correctCount : null}{" "}
          times.
        </p>
        <p className="word-count-stats">
          You have answered this word incorrectly{" "}
          {this.context.nextWord ? this.context.nextWord.incorrectCount : null}{" "}
          times.
        </p>
      </section>
    );
  };
}

export default LearningRoute;
