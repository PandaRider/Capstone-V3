import {
  LOG_IN,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "./authReducer";

import { AsyncStorage } from "react-native";
import * as firebase from "firebase";

function signUp() {
  return {
    type: SIGN_UP
  };
}

function signUpSuccess(user) {
  return {
    type: SIGN_UP_SUCCESS,
    user
  };
}

function signUpFailure(err) {
  return {
    type: SIGN_UP_FAILURE,
    error: err
  };
}

export function createUser(password, email) {
  return dispatch => {
    dispatch(signUp());
    console.log("email received: ", email);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        console.log("data from signUp: ", data);
        AsyncStorage.setItem("userToken", JSON.stringify(data))
          .then(() => {
            console.log("Token Saved");
            dispatch(signUpSuccess(data));
          })
          .catch(err => console.log("error in AsyncStorage", err));
      })
      .catch(err => {
        console.log("error signing up: ", err);
        dispatch(signUpFailure(err));
      });
  };
}

function logIn() {
  return {
    type: LOG_IN
  };
}

function logOut() {
  return {
    type: LOG_OUT
  };
}

export function logOutAndClearToken() {
  return dispatch => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem("userToken");
        dispatch(logOut());
      })
      .catch(err => {
        console.log("err: ", err);
      });
  };
}

export function logInSuccess(user) {
  return {
    type: LOG_IN_SUCCESS,
    user: user
  };
}

function logInFailure(err) {
  return {
    type: LOG_IN_FAILURE,
    error: err
  };
}

// TODO:
// Refactor this to use ES7 await
// export function signIn(email, password) {
//   return dispatch => {
//     dispatch(logIn());
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then(() => {
//         firebase.auth().onAuthStateChanged((user) => {
//           // console.log("data from signIn: ", user)
//           AsyncStorage.setItem("userToken", JSON.stringify(user)).then(() => {
//             console.log("Token Saved!")
//             // TODO:
//             // LAST CODE HERE
//             // SUSPECT APP SCREEN TRANSITION FIRST, DATA IS DISPATCHED SECOND
//             console.log("", user)
//             dispatch(logInSuccess(user));
//           })
//           .catch(err => console.log("error in AsyncStorage",err))
//         })
//       })
//       .catch(err => {
//         console.log("error from signIn: ", err);
//         dispatch(logInFailure(err));
//       });
//   };
// }

export function signIn(email, password) {
  return async dispatch => {
    dispatch(logIn());
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      await firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          await AsyncStorage.setItem("userToken", JSON.stringify(user));
          console.log("Output from onAuthStateChanged: ", user);
          console.log("Success!");
          dispatch(logInSuccess(user));
        } else {
          console.log("Still authenticating...");
        }
      });
    } catch (error) {
      console.log(error);
      dispatch(logInFailure(error));
    }
  };
}
