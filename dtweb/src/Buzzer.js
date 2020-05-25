import React, { useState, useCallback } from 'react';
import {
  Button
} from "reactstrap";

const saveUserInfo = (name) => {
  console.log(`store user ${name}`);
  sessionStorage.setItem('user', JSON.stringify(name))
};

const Buzzer = (props) => {
  const [isSending, setIsSending] = useState(false)

  const handleBuzz = useCallback(async () => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // send the actual request
      await props.socket.emit('buzz', { user: props.user });
      // once the request is sent, update state again
      setIsSending(false);
  }, [isSending, props.user, props.socket]) // update the callback if the state changes

  return (
    <div>
    <Button 
      className="btn btn-outline-primary" 
      disabled={props.buzzerDisabled}
      onClick={handleBuzz}>Buzz</Button>
    </div>
  );
}

export default Buzzer;