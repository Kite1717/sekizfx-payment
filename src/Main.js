import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Menu from "./components/Menu";
import Panel from "./components/Panel";
import Withdraw from "./components/Withdraw";
function Main() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [clientPage, setClientPage] = useState("deposit");
  useEffect(() => {

    /*
    auth_token: "c3a62a21b26df72a7016a46a794211c6"
two_factor_authentication: 0
user_id: "32"
    */
    // redirect link
    if(window.location.pathname.length > 0)
    {
      const pieces = window.location.pathname.substring(1).split("/")
      const token = pieces[0]
      const user_id = pieces[1]

      if(token !== "" && user_id !== "")
      {
        localStorage.setItem("auth",JSON.stringify({
          auth_token:token,
          two_factor_authentication:0,
          user_id,
        }))
      }
    }
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

export default Main;