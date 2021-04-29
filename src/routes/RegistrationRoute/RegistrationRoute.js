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
    history.push("/");
  };

  handleLoginSuccess = () => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || "/";
    history.push(destination);
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
          onLoginSuccess={this.handleLoginSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute;
