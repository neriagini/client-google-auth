import React, { useState, useEffect } from "react";
import { getMyGoogleCalendarsList, getMyPrimaryEvents } from "./calendarApi";
import {events} from "./event";

function App() {
  useEffect(() => {
    handleTokenFromQueryParams();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const createGoogleAuthLink = async () => {
    try {
      const request = await fetch("http://localhost:8080/createAuthLink", {
        method: "POST",
      });
      const response = await request.json();
      window.location.href = response.url;
    } catch (error) {
      console.log("App.js 12 | error", error);
      throw new Error("Issue with Login", error.message);
    }
  };

  const handleTokenFromQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const expirationDate = newExpirationDate();
    console.log("App.js 30 | expiration Date", expirationDate);
    if (accessToken && refreshToken) {
      storeTokenData(accessToken, refreshToken, expirationDate);
      setIsLoggedIn(true);
    }
  };

  const newExpirationDate = () => {
    let expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  const storeTokenData = async (token, refreshToken, expirationDate) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("expirationDate", expirationDate);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();
  };


  return (
      <div className={`flex flex-col justify-center`}>
        <p className={`font-bold text-[20px] text-center`}>Google</p>
        {!isLoggedIn ? (
            <button onClick={createGoogleAuthLink}>Login</button>
        ) : (
            <>
            <div className={`mx-auto space-x-1`}>
              <button className={`rounded-3xl border-2 p-2 bg-blue-500 text-white`} onClick={getMyGoogleCalendarsList}>
                Get Google Calendars
              </button>
              <button  className={`rounded-3xl border-2 p-2 bg-blue-500 text-white`} onClick={getMyPrimaryEvents}>
                Get Primary Events
              </button>
              <button className={`rounded-3xl border-2 p-2 bg-blue-500 text-white`} onClick={signOut}>Sign Out</button>
            </div>
            </>
        )}
      </div>
  );
}

export default App;