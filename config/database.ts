import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5ez1dnB6mVGZFF1DlLCa8OiGE3oOnSkA",
  authDomain: "todo-173b4.firebaseapp.com",
  projectId: "todo-173b4",
  storageBucket: "todo-173b4.appspot.com",
  messagingSenderId: "212183868601",
  appId: "1:212183868601:web:7d2fe9c2bfc2cb67382768",
  measurementId: "G-XR435Q4BFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);

export { auth, db ,firestore};
