import React, { useState } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink } from 'reactstrap';

import {
  Alert,
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  NavbarText
} from 'reactstrap';

import {ReactComponent as Signal1SVG } from '../images/signal-1.svg';
import {ReactComponent as Signal2SVG } from '../images/signal-2.svg';
import {ReactComponent as Signal3SVG } from '../images/signal-3.svg';
import {ReactComponent as Signal4SVG } from '../images/signal-4.svg';
import {ReactComponent as Signal5SVG } from '../images/signal-5.svg';

import InstallModal from './InstallModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LatencyDisplay = (props) => {
  let icon;
  let latency = props.latency;

    icon = (<Signal1SVG height="20px" />);

  if (latency <= 500) {
    icon = (<Signal2SVG height="20px" />);
  }
  if (latency <= 200) {
    icon = (<Signal3SVG height="20px" />)
  }
  if (latency <= 100) {
    icon = (<Signal4SVG height="20px" />);
  }
  if (latency <= 50) {
    icon = (<Signal5SVG height="20px" />);
  }

  return (
    <span>
      <div>{icon}&nbsp;&nbsp;&nbsp;{latency} mS</div>
    </span>
    );
}

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
        <NavbarBrand href="/">gobuzzyourself</NavbarBrand>
        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Help
              </DropdownToggle>
              <DropdownMenu left>
                <DropdownItem>
                  <NavLink tag={RRNavLink} exact to="/help/about" activeClassName="active">About</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink tag={RRNavLink} exact to="/help/privacy" activeClassName="active">Privacy</NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <a href="https://github.com/netik/buzzer">
                    Get Source
                  </a>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

          </Nav>
          <NavbarText style={{padding:0}}>
          {loggedInMenu}
          </NavbarText>
          <NavbarText style={{marginLeft: "30px"}}>
            <LatencyDisplay latency={props.latency}/>
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