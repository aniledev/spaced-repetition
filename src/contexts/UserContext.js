import React, { Component } from "react";
import AuthApiService from "../services/auth-api-service";
import TokenService from "../services/token-service";
import IdleService from "../services/idle-service";

const UserContext = React.createContext({
  user: {},
  error: null,
  language: null,
  words: null,
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
  setLanguage: () => {},
  setWords: () => {},
  nextWord: {},
  currentWord: {},
  totalScore: null,
  translationGuess: {},
  setNextWord: () => {},
  setCurrentWord: () => {},
  setTranslationGuess: () => {},
  setTotalScore: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = {
      user: {},
      error: null,
      language: null,
      words: null,
      nextWord: null,
      currentWord: null,
      translationGuess: null,
    };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      };

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle);
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }

  setError = (error) => {
    // console.error(error);
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setUser = (user) => {
    this.setState({ user });
  };

  // write a function that updates the state with the language and words from the server
  setLanguage = (language) => {
    this.setState({ language });
  };

  setWords = (words) => {
    this.setState({ words });
  };

  // write a functions that updates the state with nextWord, currentWord, and translationGue
  setNextWord = (nextWord) => {
    this.setState({ nextWord });
  };

  setCurrentWord = (currentWord) => {
    this.setState({ currentWord });
  };

  setTranslationGuess = (translationGuess) => {
    this.setState({ translationGuess });
  };

  setTotalScore = (totalScore) => {
    this.setState({ totalScore });
  };

  processLogin = (authToken) => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    });
    IdleService.regiserIdleTimerResets();
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken();
    });
  };

  processLogout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({});
  };

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({ idle: true });
  };

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken();
        });
      })
      .catch((err) => {
        this.setError(err);
      });
  };

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      setLanguage: this.setLanguage,
      language: this.state.language,
      setWords: this.setWords,
      words: this.state.words,
      nextWord: this.state.nextWord,
      currentWord: this.state.currentWord,
      translationGuess: this.state.translationGuess,
      setNextWord: this.setNextWord,
      setCurrentWord: this.setCurrentWord,
      setTranslationGuess: this.setTranslationGuess,
    };

    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
