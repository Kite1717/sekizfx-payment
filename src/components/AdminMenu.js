import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo2 from "../assets/logo2.svg";
function AdminMenu({ setUser, setIsAdminLogin, setType }) {
  const logOut = () => {
    setUser(null);
    setIsAdminLogin(false);
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
          <Nav.Link onClick={() => setType(-1)}>All</Nav.Link>
          <Nav.Link onClick={() => setType(0)}>Deposits</Nav.Link>
          <Nav.Link onClick={() => setType(1)}>Withdraws</Nav.Link>
          <Nav.Link onClick={() => setType(2)}>Withdraw Cancels</Nav.Link>
          <Nav.Link onClick={logOut}>Exit</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AdminMenu;
