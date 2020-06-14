import NavBar from "../../components/NavBar";
import DTHeader from "../../components/DTHeader";

import React from "react";

import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";

const PrivacyPage = (props) => {
  let sockErrorComp = null;
  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
  }
  
  return (
    <div>
      <NavBar 
        user={props.user} 
        socket={props.mainSocket}
        audioObj={props.audioObj} 
        audioLocked={props.audioLocked}
        setAudioLockedCallback={props.setAudioLockedCallback}
      />
      {sockErrorComp}
      <DTHeader/>
      <Row className="justify-content-md-center">
        <Col md="8">
        <Card>
          <CardBody>
            <CardTitle><h1>Privacy &amp; Security</h1></CardTitle>
            <hr/>
            <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
          </CardBody>
        </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PrivacyPage;

