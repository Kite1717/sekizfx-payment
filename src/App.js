import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Menu from "./components/Menu";
function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("auth") === null) {
      setUser(null);
    } else {
      console.log();
      setUser(JSON.parse(localStorage.getItem("auth")));
    }
    setLoading(false);
  }, []);
  return (

    
    <>
      {!loading && (
        <>
          {user === null || user === undefined ? (
            <Login setUser={setUser} />
          ) : (
            <>
              <Menu setUser={setUser} user={user} />
              <Payment setUser={setUser} user={user} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
