import React, { useState, useEffect } from 'react';

const ScoreBoard = (props) => {

  const [scores, setScores] = useState(null);

  useEffect(() => {
     console.log('scorerender');
     let lines = null;
     if (props.scores) {
       lines = Array.from(props.scores.entries()).map( key => {
       return <ul><li id={key[0]}>{key[1].name} with a score of {key[1].score}</li></ul>
      })
    }

     setScores(lines);
  }, [props.scores]);

  return (
    <div>
       {scores}
    </div>
  );
}

export default ScoreBoard;