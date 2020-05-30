import React, { useState, useCallback } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col,
  Card
} from "reactstrap";

const saveUserInfo = (name) => {
  console.log(`store user ${name}`);
  sessionStorage.setItem('user',JSON.stringify({ name }));
};

const LoginBox = (props) => {
  const [username, setUsername] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [isSending, setIsSending] = useState(false)
  const [submitEnabled, setSubmitEnabled] = useState(false)

  const handleSignIn = useCallback(async () => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // send the actual request
      await props.socket.emit('join', { name: username });

      saveUserInfo(username);
      // once the request is sent, update state again
      setIsSending(false);
  }, [isSending, username, props.socket]) // update the callback if the state changes

  let submitButton;
  
  if (isSending) {
    submitButton = ( <div className="spinner-border text-primary"></div> );
  } else {
    submitButton = (
      <Button color="primary" onClick={handleSignIn} disabled={!submitEnabled}>Let's go!</Button>
    );
  }

  return (
  <Container>
    <Row>
    <Col xs={1} md={2}>
    </Col>      
      <Col xs={10} md={8}>
        <Card style={{padding:'20px'}}>
          <Form>
            <legend>Login</legend>
            <FormGroup>
              <Label for="name">Enter your Name</Label>
              <Input placeholder="Name" 
                  value={username}
                  disabled={isSending}
                  onChange={event => {
                    setUsername(event.target.value);
                    if (event.target.value.length >= 3) {
                      setSubmitEnabled(true);
                    } else {
                      setSubmitEnabled(false);
                    }
                  }}/>
            </FormGroup>
            <FormGroup>
              <Label for="name">If you have a room key, enter it below. If not, leave blank.</Label>
              <Input placeholder="Key" 
                  value={roomKey}
                  disabled={isSending}
                  onChange={event => {
                    setRoomKey(event.target.value);
                  }}/>
            </FormGroup>
           {submitButton}
          </Form>
        </Card>
      </Col>
      <Col xs={1} md={2}>
      </Col>      
      </Row>
  </Container>
  );
}

export default LoginBox;