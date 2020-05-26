import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody
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
      if (lineArray.length != 4) { 
        const numToAdd = 3 - (lineArray.length - 1);
        for (let i = 0; i < numToAdd; i++) {
          lineArray.push( [i, { name: '-', score: 0, id: i, fake: true } ] );
        }
      }

      lines = lineArray.map( key => {
        return (
          <Col sm="3" key={key}>
            <Card id={key[0]} key={key[0]} body className="text-center h-100">
              { ! key[1].fake &&  
                <CardBody>
                  <h1>{key[1].name}</h1>
                  <h1>{key[1].score}</h1>
                  <small>{key[0]}</small> 
                </CardBody>
              }
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
  }, [props.scores]);

  return (
    <Container>
      <Row className="mb-0 mb-md-3">
      {scores}
      </Row>
    </Container>
  );
}

export default ScoreBoard;