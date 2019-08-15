import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyAVzF3w2dFmcntgaV-eSNDLmv9vbvjl9wg",
  authDomain: "stcapstone62-83670.firebaseapp.com",
  databaseURL: "https://stcapstone62-83670.firebaseio.com",
  projectId: "stcapstone62-83670",
  storageBucket: "stcapstone62-83670.appspot.com",
  messagingSenderId: "192257427686"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
