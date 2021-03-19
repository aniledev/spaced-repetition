import React, { Component } from "react";
import UserContext from "../../contexts/UserContext";
import { Input, Required, Label } from "../../components/Form/Form";
import Button from "../../components/Button/Button";

class LearningRoute extends Component {
  //initialize state to hold values for error logging and results from the serer
  constructor(props) {
    super(props);
    // bind event handler to this component
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // go ahead and initialize UserContext
  static contextType = UserContext;

  // write method to submit the form and check the guess translation against the server/database
  handleSubmit(event) {
    event.preventDefault();
    // create a variable for the currennt word
    // create a variable for the guess translation
    // send HTTP request to the server api/language/guess to check the guess against teh server
    // update the variable for the next word using state
  }

  // create GET request to api/language/head to start learning with the first word when the component mounts
  componentDidMount() {
  }

  render() {
    return (
      <section className="learn-route">
        {/* update p, h3, and last 2 p with data from the server once the component mounts */}
        <p>Your total score is: 999</p>
        <h2 className="learn-route-header">Translate the word:</h2>
        <span>
          <h3>Testnextword</h3>
        </span>

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
          You have answered this word correctly 222 times.
        </p>
        <p className="word-count-stats">
          You have answered this word incorrectly 333 times.
        </p>
      </section>
    );
  }
}

export default LearningRoute
