import React, { Component } from "react";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import "./registration-route.css";

class RegistrationRoute extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  handleRegistrationSuccess = () => {
    const { history } = this.props;
    history.push("/register");
    //history.push("/error") <-- this works but "/" doesnt work
    //history.push("/register") <-- this works but "/" doesnt work
    //history.push("/login") <-- this works but "/" doesnt work
  };

  render() {
    return (
      <section className="registration-route">
        <p className="registration-description">
          Practice learning a language with the spaced repetition revision
          technique.
        </p>
        <h2 className="sign-up-header">Sign up</h2>
        <RegistrationForm
          className="registration-form"
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute;
