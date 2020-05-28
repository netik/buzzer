import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Button
} from "reactstrap";

function useKeyCode(keyCode, preventDefault) {
  const [isKeyPressed, setKeyPressed] = useState();
  // Only allow fetching each keypress event once to prevent infinite loops
  if (isKeyPressed) {
    setKeyPressed(false);
  }

  useEffect(() => {
    function downHandler(event) {
      if (event.keyCode === keyCode) {
        setKeyPressed(true);
        if (preventDefault) {
          event.preventDefault();
        }
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [keyCode, preventDefault]);

  return isKeyPressed;
}

const Buzzer = (props) => {
  const [isSending, setIsSending] = useState(false);
  const spacePress = useKeyCode(32, true);

  const handleBuzz = async () => {
      // don't send again while we are sending
      if (isSending) return;
      console.log('handlebuzz');
      // update state
      setIsSending(true);

      // send the actual request
      await props.socket.emit('buzz', { user: props.user });
      // once the request is sent, update state again
      setIsSending(false);
  }; // update the callback if the state changes

  if (spacePress) { handleBuzz() }

  return (
    <Row>
      <Col className="text-center" sm="12">
      <Button 
      className="btn btn-danger btn-jumbo" 
      disabled={props.buzzerDisabled}
      onClick={handleBuzz}>Buzz</Button>
      {! props.buzzerDisabled &&  
        <p className="text-muted">
         Hit the <i>Spacebar</i> or click Buzz to Buzz in now!
        </p>
      } 
      </Col>
    </Row>
  );
}

export default Buzzer;