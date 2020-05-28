import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from 'reactstrap';

const ScoreBoard = (props) => {

  const [scores, setScores] = useState(null);

  useEffect(() => {
     console.log('scorerender');
     let lines = null;
          
     if (props.scores) {
      let lineArray = Array.from(props.scores.entries());
      console.log(lineArray.length);

      // make sure there's at least four columns at the bottom.
      if (lineArray.length !== 4) { 
        const numToAdd = 3 - (lineArray.length - 1);
        for (let i = 0; i < numToAdd; i++) {
          lineArray.push( [i, { name: '-', score: 0, id: i, fake: true } ] );
        }
      }

      lines = lineArray.map( key => {
        let style=null;

        if (key[0] === props.lastBuzz?.id) {
          console.log('set style');
          style={ "backgroundColor":"blue" }
        }
        
        let playerCard = (
          <CardBody style={style}>
            <h1>{key[1].name}</h1>
            <h1>
              {key[1].score}
            </h1>
            <small>{key[0]}</small>
            <hr/>
            <Button 
              key={`${key[0]}-score-minus`} 
              color="danger" 
              size="small" 
              className="float-left">-</Button>
            <Button 
              key={`${key[0]}-score-plus`}
              color="danger" 
              size="small" 
              className="float-right">+</Button>
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
  }, [props.scores,props.lastBuzz]);

  return (
    <Container>
      <Row className="mb-0 mb-md-3">
      {scores}
      </Row>
    </Container>
  );
}

export default ScoreBoard;