import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from '../context/AuthContext'
import { auth } from "../firebaseSetup";
import { onAuthStateChanged } from "firebase/auth";



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [contactHistory, setContactHistory] = useState(null);
  const [userData, setUserData] = useState({
    nama: "Not Logged In",
    email:"null@mail.com",
  });

  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{userData, user, setUserData, setAdmin, admin, contactHistory, setContactHistory }}>{children}</AuthContext.Provider>;
};