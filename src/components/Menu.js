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
        <img alt="logo2" src={logo2} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => setClientPage("deposit")}>Yatırma</Nav.Link>
          <Nav.Link onClick={() => setClientPage("withdraw")}>
            Çekim
          </Nav.Link>
          <Nav.Link onClick={logOut}>Çıkış</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu;
