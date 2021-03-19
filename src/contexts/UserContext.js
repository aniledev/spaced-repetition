import React, { Component } from "react";
import AuthApiService from "../services/auth-api-service";
import TokenService from "../services/token-service";
import IdleService from "../services/idle-service";

// add language to to the context so the language name can be shared
// list of words also is initially null because no calls to the server has been made initially
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
  // add empty callback functions for setting the language and the list of words
  setLanguage: () => {},
  setWords: () => {},
  // add the next word and current word to the context based on the response object from service/database
  nextWord: {},
  currentWord: {},
  // create a variable to hold the guessed translation from the user
  translationGuess: {},
  // use this empty callback function to update the state to show the next word and the current word in the word table database
  setNextWord: () => {},
  setCurrentWord: () => {},
  /// use this empty callback function to set the guess to be sent to the service/server to verify
  setTranslationGuess: () => {},
  // will i need the total score to be updated in context????
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
    console.error(error);
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
  setNextWord = nextWord => {
    this.setState({nextWord})
  }

  setCurrentWord = currentWord => {
    this.setState({currentWord})
  }

  setTranslationGuess = translationGuess => {
    this.setState({translationGuess})
  }


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
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
