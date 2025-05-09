import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase"; // Firebase authentication import
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state change listener

interface AuthContextType {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: any; // Use 'any' or a specific Firebase user type if you want
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null); // You can type this based on your Firebase user
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      setCurrentUser(user);

      // Check if the user signed in with email/password
      const isEmail = user.providerData.some(
        (provider: any) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
