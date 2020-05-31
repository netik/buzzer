import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ScoreBoard = (props) => {

  const [scores, setScores] = useState(null);

  useEffect(() => {
    const handleScoreChange = (id, direction, e) => {
      if (direction === "down") {
        props.socket.emit('scoredown', id);
      } else {
        props.socket.emit('scoreup', id);
      }
    };  

    console.log('scorerender');
    let lines = null;

    if (props.scores) {
      let lineArray = Array.from(props.scores.entries());
      // make sure there's at least four columns at the bottom.
      if (lineArray.length !== 4) { 
        const numToAdd = 3 - (lineArray.length - 1);
        for (let i = 0; i < numToAdd; i++) {
          lineArray.push( [i, { name: '-', score: 0, id: i, fake: true } ] );
        }
      }

      lines = lineArray.map( key => {
        let style=null;
        let hostButtons=null;

        // if this card buzzed in, make it blue.
        if (key[0] === props.lastBuzz?.id) {
          console.log('set style');
          style={ "backgroundColor":"blue" }
        }

        // if this is the host page, show the score change buttons
        if (props.host === true) {
          hostButtons = (
            <div>
              <small>{key[0]}</small>
              <hr/>
                <Button 
                  id={`${key[0]}-score-minus`} 
                  key={`${key[0]}-score-minus`} 
                  color="danger" 
                  size="small"
                  onClick={(e) => handleScoreChange(key[0], 'down', e)} 
                  className="float-left"><FontAwesomeIcon icon="minus-square" size="2x"/></Button>
                <Button 
                  id={`${key[0]}-score-plus`} 
                  key={`${key[0]}-score-plus`}
                  color="danger" 
                  size="small" 
                  onClick={(e) => handleScoreChange(key[0], 'up', e)} 
                  className="float-right"><FontAwesomeIcon icon="plus-square" size="2x"/></Button>
            </div>
          );
        }
        
        // build the player card
        let playerCard = (
          <CardBody style={style}>
            <h1>{key[1].name}</h1>
            <h1>
              {key[1].score}
            </h1>
            {hostButtons}
          </CardBody>
        );
    
        return (
          <Col sm="3" key={key}>
            <Card id={key[0]} key={key[0]} body className="text-center h-100">
              { ! key[1].fake && playerCard}
              { key[1].fake &&  
                <CardBody>
                  <i>waiting for player</i>
                </CardBody>
              }
            </Card>
          </Col>
          );
      });
      setScores(lines);
    }
  }, [props.socket, props.scores,props.lastBuzz, props.host]);

  return (
    <Container>
      <Row className="mb-0 mb-md-3">
      {scores}
      </Row>
    </Container>
  );
}

export default ScoreBoard;