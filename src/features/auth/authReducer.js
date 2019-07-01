export const LOG_IN = "LOG_IN";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";
export const LOG_OUT = "LOG_OUT";

export const SIGN_UP = "SIGN_UP";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

const initialState = {
  isAuthenticating: false,
  user: {},

  signUpError: false,
  signInError: false,

  signInErrorMessage: "",
  signUpErrorMessage: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP:
      return {
        ...state,
        isAuthenticating: true
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isAuthenticating: false
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        signUpError: true,
        signUpErrorMessage: action.error.message
      };
    case LOG_IN:
      return {
        ...state,
        isAuthenticating: true,
        signInError: false
      };
    case LOG_IN_SUCCESS:
      return {
        isAuthenticating: false,
        user: action.user
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        signInError: true,
        signInErrorMessage: action.error.message
      };
    case LOG_OUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
