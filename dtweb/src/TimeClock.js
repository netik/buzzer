import React from 'react';

const TimeClock = (props) => {
  const formatTime = (t) => {
    const min = `${Math.floor(t / 60)}`;
    const sec = `${t - (min*60)}`;
  
    return `${min.padStart(2,'0')}:${sec.padStart(2,'0')}`; 
  };

  return (
    <div>
      {formatTime(props.timeRemain)}
    </div>
  );
}

export default TimeClock;