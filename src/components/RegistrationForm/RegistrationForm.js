import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Input, Required, Label } from "../Form/Form";
import AuthApiService from "../../services/auth-api-service";
import UserContext from "../../contexts/UserContext";
import Button from "../Button/Button";
import "./RegistrationForm.css";

class RegistrationForm extends Component {
  static contextType = UserContext;

  static defaultProps = {
    onRegistrationSuccess: () => {},
    onLoginSuccess: () => {},
  };

  state = { error: null };

  firstInput = React.createRef();

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { name, username, password } = ev.target;
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then((user) => {
        // immediately log in the user after they have registered
        this.logInAfterRegister(username, password);
        name.value = "";
        username.value = "";
        password.value = "";
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
    this.setState({ error: null });
  };

  logInAfterRegister(username, password) {
    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then((res) => {
        username.value = "";
        password.value = "";
        this.context.processLogin(res.authToken);
        this.props.onLoginSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  componentDidMount() {
    this.firstInput.current.focus();
  }

  render() {
    const { error } = this.state;
    return (
      <form className="registration-form" onSubmit={this.handleSubmit}>
        <div role="alert">{error && <p>{error}</p>}</div>
        <div className="label-input">
          <Label htmlFor="registration-name-input">
            Enter your name
            <Required />
          </Label>
          <Input
            className="registration-input"
            ref={this.firstInput}
            id="registration-name-input"
            name="name"
            placeholder="Elina McGill"
            required
          />
        </div>
        <div className="label-input">
          <Label htmlFor="registration-username-input">
            Choose a username
            <Required />
          </Label>
          <Input
            className="registration-input"
            id="registration-username-input"
            name="username"
            placeholder="aniledev"
            required
          />
        </div>
        <div className="label-input">
          <Label htmlFor="registration-password-input">
            Choose a password
            <Required />
          </Label>
          <Input
            className="registration-input"
            id="registration-password-input"
            name="password"
            type="password"
            placeholder="****************"
            required
          />
        </div>
        <footer className="label-input registration-footer">
          <div className="button-div">
            <Button className="sign-up-button" type="submit">
              Sign up
            </Button>
          </div>

          <Link className="existing-account-link" to="/login">
            Already have an account?
          </Link>
        </footer>
      </form>
    );
  }
}

export default RegistrationForm;
