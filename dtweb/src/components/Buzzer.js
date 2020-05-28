import React, { useRef, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Button
} from "reactstrap";
import _ from "lodash";

import useKeyboardShortCut from '../useKeyboardShortcut';

const Buzzer = (props) => {
  const [isSending, setIsSending] = useState(false);
  
  // Because it takes some time for React's state to settle, we add a small
  // delay to debounce the spacebar.
  const delayedBuzz = useRef(
    _.debounce(q => props.socket.emit('buzz', q), 150)
  ).current;
  
  const handleBuzz = useCallback(async () => {
    // don't send again while we are sending
    if (isSending) return;
    
    // update state
    setIsSending(true);
    // send the actual request
    delayedBuzz({ user: props.user });
    // once the request is sent, update state again
    setIsSending(false);
  }, [isSending, delayedBuzz, props.user]); // update the callback if the state changes

  const keys = [' '];
  const handleKeyboardShortcut = useCallback(keys => {
    handleBuzz();
  }, [handleBuzz]);

  useKeyboardShortCut(keys, handleKeyboardShortcut);

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