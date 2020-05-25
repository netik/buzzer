import React from 'react';

const ScoreBoard = (props) => {

  let lines;

  if (props.scores) {

    lines = Array.from(props.scores.entries()).map( key => {
      console.log(key);
     return <ul><li key={key[0]}>{key[1].name} with a score of {key[1].score}</li></ul>
   });
  }

  return (
    <div>
       {lines}
    </div>
  );
}

export default ScoreBoard;