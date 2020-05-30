import React from 'react';
import {
  Container,
  Row,
  Col
} from "reactstrap";

import Logo from "../images/dirtytalk-fs-trans.png";

const DTHeader = (props) => {
  return (
    <Container>
      <Row className="align-items-center">
        <Col md={2} key="1" className="d-none d-lg-block">
          <img src={Logo} 
                className="headerLogo"
                key="3" 
                alt="Logo"
                width="180"
                height="120"/>
        </Col>
        <Col md={8} key="2">
          <span className="align-items-center text-center">
            <h2>
              The Dirty Talk Game Show
            </h2>
          </span>
        </Col>
        <Col md={2} className="d-none d-lg-block">
          <img src={Logo} 
            className="headerLogo"
            key="3" 
            alt="Logo"
            width="180"
            height="120"/>
        </Col>
      </Row>
    </Container>
  );
}

export default DTHeader;
