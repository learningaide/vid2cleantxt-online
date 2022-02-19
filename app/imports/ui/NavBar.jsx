import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {
    NavLink
  } from "react-router-dom";
import AccountsUIWrapper from './AccountsUIWrapper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import LanguageSelector from './LanguageSelector';

function NavBar (props) {
    const {isLoggedIn, username, openLoginModal, logout} = props;
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/">Vid2cleantxt-online</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/videos">Transcribe</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{paddingRight: "0px"}}>
          <AccountsUIWrapper />
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{paddingRight: "0px"}}>
          <div style={{marginLeft: "0px"}}>
            <LanguageSelector />
          </div>
        </Navbar.Collapse>
      </Navbar>
    )
  }

export default NavBar;