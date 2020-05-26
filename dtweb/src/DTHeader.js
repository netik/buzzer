import React from 'react';
import {
  Container,
  Row,
  Col
} from "reactstrap";

import Logo from "./images/dirtytalk-fs-trans.png";

const DTHeader = (props) => {
  return (
    <Container>
      <Row>
        &nbsp;
      </Row>
    <Row className="d-flex align-items-center">
      <Col className="d-flex justify-content-start" key="1">
        <img src={Logo} className="headerLogo"/>
      </Col>
      <Col className="d-flex justify-content-center" key="2">
        <span className="d-flex justify-content-center align-items-center text-center">
          <h2>
            The Dirty Talk Game Show
          </h2>
        </span>
      </Col>
      <Col className="d-flex justify-content-end">
        <img src={Logo} className="headerLogo" key="3"/>
      </Col>
    </Row>
    </Container>
  );
}

export default DTHeader;
