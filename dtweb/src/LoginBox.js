import React, { useState, useCallback } from 'react';
import {
  Input,
  Button
} from "reactstrap";

const saveUserInfo = (name) => {
  console.log(`store user ${name}`);
  sessionStorage.setItem('user', JSON.stringify(name))
};

const LoginBox = (props) => {
  const [username, setUsername] = useState("");
  const [isSending, setIsSending] = useState(false)

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

  return (
    <div>
    Your name?
    <Input placeholder="Name" 
           value={username}
           disabled={isSending}
           onChange={event => setUsername(event.target.value)}/>

    <Button className="btn btn-outline-primary" onClick={handleSignIn}>Let's go!</Button>
    </div>
  );
}

export default LoginBox;