import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Header() {
  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand href="https://signalwire.com">
            <img
              src="/swlogo.png"
              className="d-inline-block align-top"
              style={{ width: 180 }}
              alt="SignalWire Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="https://developer.signalwire.com">
                Developer's Portal
              </Nav.Link>
              <NavDropdown title="Tutorial" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/signalwire-communications-api">
                  Getting Started with the SignalWire Communications API
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/signing-up-for-a-space">
                  Your First SignalWire Space
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/getting-started-with-the-signalwire-video-api-1">
                  Getting Started with the SignalWire Video API
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
