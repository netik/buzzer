import React, { useState, useCallback } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row
} from "reactstrap";

const saveUserInfo = (name) => {
  console.log(`store user ${name}`);
  sessionStorage.setItem('user',JSON.stringify({ name }));
};

const LoginBox = (props) => {
  const [username, setUsername] = useState("");
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
    <Form>
      <legend>Login</legend>
      <FormGroup>
        <Label for="name">Your Name?</Label>
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

      {submitButton}
    </Form>
    </Row>
  </Container>
  );
}

export default LoginBox;