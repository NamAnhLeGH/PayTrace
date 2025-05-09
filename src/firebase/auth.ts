import { auth } from "./firebase"; // Import the Firebase auth object
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";

// Create user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const doSignOut = () => {
  return auth.signOut();
};

// Send password reset email
export const doPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// Change password
export const doPasswordChange = (password: string) => {
  return updatePassword(auth.currentUser!, password); // Use `!` to tell TypeScript currentUser is not null
};

// Send email verification to the current user
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser!, {
    url: `${window.location.origin}/home`, // URL to redirect after verification
  });
};
