import React from "react";
import { Navbar, Nav } from "react-bootstrap";
function Menu({ user, setUser }) {
  const logOut = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("auth-admin");
  };
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="#home">Deposit</Navbar.Brand>
      <Nav className="mr-auto">
        {/* <Nav.Link href="#home">WithDraw</Nav.Link> */}
        <Nav.Link onClick={logOut} href="#">
          Exit
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default Menu;
