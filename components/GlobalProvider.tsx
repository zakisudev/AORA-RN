import { useEffect, useState } from "react";
import MyGlobalContext from "../context/GlobalContext";
import { getCurrentUser } from "../lib/appwrite";

const GlobalProvider = ({ children }:any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch the current user:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <MyGlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
      {children}
    </MyGlobalContext.Provider>
  );
};

export default GlobalProvider;
