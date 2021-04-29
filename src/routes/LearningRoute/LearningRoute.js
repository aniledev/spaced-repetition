import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import { Input, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import "./LearningRoute.css";

class LearningRoute extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keypressClearFeedback = this.keypressClearFeedback.bind(this);
    this.handleNextWordButton = this.handleNextWordButton.bind(this);
    this.state = {
      error: null,
      results: false,
      loading: false,
    };
  }

  static contextType = UserContext;

  // write method to submit the form and check the guess translation against the server/database
  handleSubmit(event) {
    event.preventDefault();

    // check if results have been sent back from the server, if true, then update
    if (this.state.results) {
      this.setState({ onResults: !this.state.onResults }); // true
      setTimeout(
        () => document.getElementById("learn-guess-input").focus(),
        250
      );
    } else {
      // create a variable for the current word so it shows the next one on page load
      this.context.setCurrentWord(this.context.nextWord);
      // create a variable for the guess translation
      this.context.setTranslationGuess(event.target.guess.value);
      this.setState({ results: !this.state.results, loading: true }); // true, true

      // post the fetch to the server to check the guess against the database
      // send HTTP request to the server api/language/guess to check the guess against teh server
      fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({ guess: event.target.guess.value }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.context.setNextWord(json);
          this.showFeedback();
          this.showFeedbackExplanation();
          document.getElementById("overlay").focus();
          document.getElementById("cover").focus();
          this.setState({ loading: false });
          document.getElementById("learn-guess-input").value = "";
        });
    }
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
          this.setState({ loading: false });
        })
        .catch((err) => this.setState({ error: err }))
    );
  }

  // write a function that clears the feedback jsx based on conditional rendering
  clearFeedback() {
    document.getElementById("overlay").classList.add("invisible");
    document.getElementsByClassName("button").focus();
  }

  // write a function that allows the feedback to be shown through accessibility keyboard presses
  keypressClearFeedback(event) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      this.clearFeedback();
    }
  }

  // use conditional rendering to show the feedback section
  showFeedback() {
    const element = document.getElementById("overlay");
    element.classList.remove("invisible");
    setTimeout(() => {
      element.classList.add("invisible");
    }, 7500);
  }

  showFeedbackExplanation() {
    const element = document.getElementById("cover");
    element.classList.remove("invisible");
    setTimeout(() => {
      element.classList.add("invisible");
    }, 7500);
  }

  // write a function that renders submit answer button or next word button
  generateButton() {
    // if there are results, then load the next word; if results false, submit answer
    if (this.state.results === true) {
      return (
        <Button
          className="button guess-word-button"
          type="button"
          onClick={this.handleNextWordButton}
        >
          {this.generateButtonText()}
        </Button>
      );
    } else {
      return (
        <Button className="button guess-word-button" type="submit">
          {this.generateButtonText()}
        </Button>
      );
    }
  }

  // this is the event handler function that triggers when the guess response has been received, and the user clicks next word button
  handleNextWordButton() {
    // reset the state results and loading so that the state is initial values
    this.setState({
      error: null,
      results: false,
      loading: false,
    });
  }

  generateButtonText() {
    // state.results is declared, meaning that the HTTP POST guess has been sent to the server
    // if true return try again text, if false return submit
    if (this.state.results === true) {
      return "Try Next Word";
    } else {
      return "Submit Answer";
    }
  }

  // write a function to display the response text based on certain conditions
  renderAnswerExplanation() {
    // if context contains the next word, context.nextWord, if the HTTP POST request has received a response
    // return the correct translation text
    if (this.context.currentWord) {
      if (typeof this.context.nextWord.isCorrect !== undefined) {
        if (this.context.nextWord.isCorrect) {
          return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer}. You entered ${this.context.translationGuess}.`;
        } else {
          return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer}. You entered ${this.context.translationGuess}.`;
        }
      }
    }
  }

  //write a function to render the correct answer conditionally based on conditions
  renderResponseText() {
    if (this.context.nextWord) {
      if (typeof this.context.nextWord.isCorrect !== undefined) {
        if (this.context.nextWord.isCorrect) {
          return "Correct! Great job!";
        } else {
          return "That's not quite right. Try again next time.";
        }
      }
    }
  }

  render() {
    // eslint-disable-next-line no-lone-blocks
    return (
      <section className="learn-route">
        <div className="DisplayScore">
          <p className="correct">
            Your total score is:{" "}
            {this.context.nextWord ? this.context.nextWord.totalScore : null}
          </p>
        </div>
        <h2 className="learn-route-header">Translate the word</h2>
        <form onSubmit={this.handleSubmit}>
          <Label htmlFor="learn-guess-input">
            <h3 className="learn-subtitle">
              What's the translation for this word?
            </h3>
          </Label>
          <span>
            <h4 className="word">
              {this.context.nextWord ? this.context.nextWord.nextWord : null}
            </h4>
          </span>
          <div className="input-button">
            <Input
              className="learn-guess-input"
              ref={this.firstInput}
              id="learn-guess-input"
              name="guess"
              type="text"
              placeholder="translation"
              maxLength="20"
              autoFocus={true}
              required
            />
            {this.generateButton()}
          </div>
        </form>
        <div className="DisplayFeedback invisible">
          <h2
            className="overlay invisible"
            id="overlay"
            tabIndex="0"
            onKeyPress={this.keypressClearFeedback}
            onClick={this.clearFeedback}
            aria-live="polite"
          >
            {this.renderResponseText()}
          </h2>
          <p
            className="cover invisible"
            id="cover"
            tabIndex="0"
            onKeyPress={this.keypressClearFeedback}
            onClick={this.clearFeedback}
            aria-live="polite"
          >
            {this.renderAnswerExplanation()}
          </p>
        </div>
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
  }
}

export default LearningRoute;
