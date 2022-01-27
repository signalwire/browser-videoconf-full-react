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
                <NavDropdown.Divider />

                <NavDropdown.Header>
                  Making a Zoom clone with the SignalWire Video APIs
                </NavDropdown.Header>

                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/making-a-zoom-clone-with-signalwire-video-apis">
                  1. Overview
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/writing-a-backend-to-proxy-signalwire-video-rest-api">
                  2. Writing a backend to proxy SignalWire Video REST API
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/writing-a-basic-react-frontend">
                  3. A basic React frontend
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/working-with-microphones-cameras-and-speakers">
                  4. Working with microphones, cameras and speakers
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/changing-layouts">
                  5. Changing layouts
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/sharing-screen">
                  6. Screen sharing
                </NavDropdown.Item>
                <NavDropdown.Item href="https://developer.signalwire.com/apis/docs/moderator-controls">
                  7. Listing members and Moderator controls
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
