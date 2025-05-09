// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGDmTvk6AWtk93xdmFiNQgIc4TFHqzoPw",
  authDomain: "paytrace-34004.firebaseapp.com",
  projectId: "paytrace-34004",
  storageBucket: "paytrace-34004.firebasestorage.app",
  messagingSenderId: "657971194708",
  appId: "1:657971194708:web:8ef1d7f3965d38975a36c1",
  measurementId: "G-57JV5KX3W3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
