import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyAVzF3w2dFmcntgaV-eSNDLmv9vbvjl9wg",
  authDomain: "stcapstone62-83670.firebaseapp.com",
  databaseURL: "https://stcapstone62-83670.firebaseio.com",
  projectId: "stcapstone62-83670",
  storageBucket: "stcapstone62-83670.appspot.com",
  messagingSenderId: "192257427686"
};

export default (!firebase.apps.length ? firebase.initializeApp(config) : firebase.app());

//Example use: copy code snippet below to another file in the same folder

// import firebase from "./Firebase";

// var db = firebase.firestore();

// db.collection("boards")
//   .get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//       console.log(doc.id, "=>", doc.data());
//     });
//   })
//   .catch(err => {
//     console.log("Error getting documents", err);
//   });

// firebase.firestore().collection("user").doc("fabian").set({ message: "how are you" });