import React, { useState } from 'react';
import {
  Alert,
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  NavbarText
} from 'reactstrap';

import InstallModal from './InstallModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const rightToggle =  () => setRightIsOpen(!rightIsOpen);

  let loggedInMenu;

  const attemptUnlock = (props) => {
    props.setAudioLockedCallback(false);
  };

  if (props.user) {
    loggedInMenu = (
      <Dropdown isOpen={rightIsOpen} toggle={rightToggle}>
        <DropdownToggle nav caret>
          Logged in as <b>{props.user?.name}</b>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="a" href="/logout">
              Logout / Change Name
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  } else {
    loggedInMenu = (<div>Not Logged In</div>);
  }

  return (
    <div>
      <InstallModal/>
      <Navbar color="primary" dark expand="md">
        <NavbarBrand href="#">gobuzzyourself</NavbarBrand>
        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/netik/buzzer">Source</NavLink>
            </NavItem>
          </Nav>
          <NavbarText style={{padding:0}}>
          {loggedInMenu}
          </NavbarText>
        </Collapse>
      </Navbar>
      { props.audioLocked &&
           <Alert color="secondary">
             <Button 
               className="btn btn-success" 
               onClick={() => { attemptUnlock(props) }}>
               <FontAwesomeIcon icon="volume-up" />
               <span style={{ paddingLeft: '10px'}}>Permit Audio</span>
             </Button>
             {" "}
              <span style={{ paddingLeft: '10px'}}>
                Your browser is blocking some sounds. Please click 'Permit Audio' to hear all game sounds. 
              </span>
            </Alert>
           }
    </div>
  );
} 

export default NavBar;