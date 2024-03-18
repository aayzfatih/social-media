// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxUi9tcJEgPLO-7rr7iEYZLaMyAiVOX0s",
  authDomain: "full-stack-project-a94b9.firebaseapp.com",
  projectId: "full-stack-project-a94b9",
  storageBucket: "full-stack-project-a94b9.appspot.com",
  messagingSenderId: "933696813682",
  appId: "1:933696813682:web:7a582372688aeca7bd60eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
