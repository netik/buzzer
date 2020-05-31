import React, { useState } from 'react';
import {
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

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const rightToggle =  () => setRightIsOpen(!rightIsOpen);

  let loggedInMenu;

  const attemptUnlock = (props) => {
    props.audioObj.play().then(() => {
      console.log('Audio OK!');
      // turn this off, we're good!
      props.setAudioLockedCallback(false);
    }).catch((e) => {
        console.log('Audio is locked :(');
        console.log(e);
    });
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
      <Navbar color="primary" dark expand="md">
        <NavbarBrand href="#">gobuzzyourself</NavbarBrand>
        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/netik/buzzer">Source</NavLink>
            </NavItem>
          </Nav>
          { props.audioLocked &&
           <Button onClick={() => { attemptUnlock(props) }}>
            Unmute Audio
           </Button> 
           }
          <NavbarText style={{padding:0}}>
          {loggedInMenu}
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;