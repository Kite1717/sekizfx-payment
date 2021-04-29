import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo2 from "../assets/logo2.svg";
function Menu({ user, setUser, setClientPage }) {
  const logOut = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("auth-admin");
  };
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">
        <img src={logo2} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => setClientPage("deposit")}>Deposit</Nav.Link>
          <Nav.Link onClick={() => setClientPage("withdraw")}>
            Withdraw
          </Nav.Link>
          <Nav.Link onClick={logOut}>Exit</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu;
