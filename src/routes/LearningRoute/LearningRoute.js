import React, { Component } from "react";
import config from "../../config";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import { Input, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import "./LearningRoute.css";

class LearningRoute extends Component {
  //initialize state to hold values for error logging and results from the serer
  constructor(props) {
    super(props);
    // bind event handler to this component
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keypressClearFeedback = this.keypressClearFeedback.bind(this);
    this.state = {
      error: null,
      // create this.state.results to determine if the server has update with results; this can conditionally render the correct incorrect feedback text
      results: false,
      loading: true,
      // shoudn't loading be false at the onset of the component loading
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
    // possible way to render feedback; did not pass tests
    // .then((res) => res.json())
    // .then((json) => {
    //   this.context.setNextWord(json);
    //   this.showFeedback();
    //   document.getElementById("feedback-overlay").focus();
    //   this.setState({ loading: false });
    //   document.getElementById("learn-guess-input").value = "";
    // });
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
    // if the key is enter or spacebar, then clear feedback for accessibility users
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
    }, 2500);
  }

  // write a function that renders submit answer button or next word button
  generateButton() {
    // if there are results, then load the next word; if results false, submit answer
    if (this.state.results) {
      return (
        <Button className="button next-word-button" type="button">
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

  // this is the event handler function that triggers when the guess repsonse has been received, and the user clicks next word button
  nextWord() {
    // update the current word in the context so we move to the next word
    // reset the state results and loading so that the state is initial values
    // ensure that the current word is not a repeat
    // hide any invisible content on the page, that became visible
  }

  generateButtonText() {
    // state.results is declared, meaning that the HTTP POST guess has been sent to the server
    // if true return try again text, if false return submit
    if (this.state.results) {
      return "Next";
    } else {
      return "Submit Answer";
    }
  }

  // write a function to display the response text based on certain conditions
  renderAnswerExplanation() {
    // if context contains the next word, context.nextWord, if the HTTP POST request has received a response
    // return the correct translation text
    if (
      this.context.nextWord &&
      typeof this.context.nextWord.isCorrect !== undefined
    ) {
      return "The correct answer to this was. You guessed";
      // return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer}. You chose ${this.context.guess}`;
    }
  }

  //write a function to render the correct answer conditionally based on conditions
  renderResponseText() {
    // if nextWord.isCorrect !== undefined -> do I ned to check for that?
    // if context contains the next word based on our HTTP request
    // context is updated with nextWord, loading == false, and results === true
    if (this.context.nextWord) {
      if (typeof this.context.nextWord.isCorrect !== undefined) {
        if (this.context.nextWord.isCorrect) {
          // return the correct word explanation if nextWord.isCorrect is defined in context, say the database is empty
          return "Correct! Great job!";
        } else {
          // else return the incorrect word explanation
          return "That's not quite right. Try again next time.";
        }
      }
    }
  }

  render() {
    // eslint-disable-next-line no-lone-blocks
    {
      /*
     I need to conditionally render a feedback div to show whether answer was right.
     I need to conditionally render the correct answer
     I need to conditionally render the button to either be a show answer or next word button
    */
    }

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
            <Button className="button guess-word-button" type="submit">
              {/* Submit Answer */}
              {this.generateButtonText()}
            </Button>
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
            // className={this.state.results ? "" : "hidden"}
            id="overlay"
            className="overlay invisible"
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
