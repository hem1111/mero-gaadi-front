import React from "react";
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    var token = localStorage.getItem("ownerToken");
    if (token) {
      var decoded = jwt_decode(token);
      setOwnerId(decoded?.ownerId || "");
      setUserName(decoded?.name);
      setAuthenticated(true);
    } else setAuthenticated(false);
    setLoading(false);
  }, [authenticated]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        setAuthenticated,
        ownerId,
        setOwnerId,
        userName,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
