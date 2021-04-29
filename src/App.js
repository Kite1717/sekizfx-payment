import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Menu from "./components/Menu";
import Panel from "./components/Panel";
import Withdraw from "./components/Withdraw";
function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [clientPage, setClientPage] = useState("deposit");
  useEffect(() => {
    if (localStorage.getItem("auth") === null) {
      setUser(null);
    } else {
      setUser(JSON.parse(localStorage.getItem("auth")));
    }
    if (localStorage.getItem("auth-admin") !== null) {
      setIsAdminLogin(true);
    }
    setLoading(false);
  }, []);

  const pageRenderer = () => {
    if (!loading) {
      if (isAdminLogin) {
        return <Panel setUser={setUser} setIsAdminLogin={setIsAdminLogin} />;
      } else if (user === null || user === undefined) {
        return <Login setUser={setUser} setIsAdminLogin={setIsAdminLogin} />;
      } else {
        return (
          <>
            <Menu setClientPage={setClientPage} setUser={setUser} user={user} />
            {clientPage === "deposit" ? (
              <Payment setUser={setUser} user={user} />
            ) : (
              <Withdraw setUser={setUser} user={user} />
            )}
          </>
        );
      }
    }
  };
  return <>{pageRenderer()}</>;
}

export default App;
