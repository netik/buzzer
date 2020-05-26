import React, { useState, useCallback } from 'react';
import {
  Row,
  Col,
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
    <Row>
      <Col className="text-center" sm="12">
      <Button 
      className="btn btn-danger btn-jumbo" 
      disabled={props.buzzerDisabled}
      onClick={handleBuzz}>Buzz</Button>
      {! props.buzzerDisabled &&  
        <p class="text-muted">
         Hit the <i>Spacebar</i> or click Buzz to Buzz in now!
        </p>
      } 
      </Col>
    </Row>
  );
}

export default Buzzer;