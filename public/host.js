const socket = io();
const active = document.querySelector('.js-active');
const clock = document.querySelector('.js-clock');
const clear = document.querySelector('.js-clear');
const resetclock = document.querySelector('.js-resetclock');
const resetscores = document.querySelector('.js-resetscores');
const startclock = document.querySelector('.js-startclock');
const pauseclock = document.querySelector('.js-pauseclock');
const lastbuzz = document.querySelector('.js-lastbuzz');
const addtime = document.querySelector('.js-addtime');
const subtime = document.querySelector('.js-subtime');
const scoreboard = document.querySelector('.js-scoreboard');

/* this stuff was supported in our hardware game...
    helpstr = [ { "key": "SPACE", "text": "Stop/Start clock" }, 
                { "key": "SHIFT-ESC" , "text": "Quit" },
                { "key": "H or ?" , "text": "HELP" },
                { "key": "1" , "text": "+1 point Player 1" },
                { "key": "2" , "text": "+1 point Player 2" },
                { "key": "3" , "text": "+1 point Player 3" },
		{ "key": "4" , "text": "+1 point Player 4" },
                { "key": "Q" , "text": "-1 point Player 1" },
                { "key": "W" , "text": "-1 point Player 2" },
                { "key": "E" , "text": "-1 point Player 3" },
		{ "key": "R" , "text": "-1 point Player 4" },
                { "key": "P" , "text": "Clock: +5 seconds" },
                { "key": "L" , "text": "Clock: -5 seconds" },
		{ "key": "T" , "text": "Play a \"time's up\" sound" },
                { "key": "B" , "text": "Play a buzzer sound" },
                { "key": "N" , "text": "Name Players" },
		{ "key": "S" , "text": "Draw Splash Screen" },
                { "key": "SHIFT-A" , "text": "Reset game" },
                { "key": "SHIFT-Z" , "text": "Reset Clock" },                    ]
*/

function generateScoreboard(usertable) {
  scoreboard.innerHTML = '';
  scoreboard.appendChild(document.createTextNode('Scores'));
  console.log(data);
}

socket.on('active', (data) => {
  // an update to the active user list
  var newMap = new Map(JSON.parse(data));
  console.log(newMap);
  active.innerText = `${newMap.size} connected.`

  generateScoreboard(data);
});

socket.on('tick', (data) => {
  const min = `${Math.floor(data.timeRemain / 60)}`;
  const sec = `${data.timeRemain - (min*60)}`;

  clock.innerText = `${min.padStart(2,'0')}:${sec.padStart(2,'0')}`; 
});

socket.on('lastbuzz', (buzz) => {
  if (buzz !== null) {
    lastbuzz.innerHTML = `${buzz.name} buzzed in first!`;
  } else {
    // this is a clear request
    lastbuzz.innerHTML = '';
  }
});

// buttons
clear.addEventListener('click', () => {
  lastbuzz.innerHTML = ``;
  socket.emit('clear')
});

resetclock.addEventListener('click', () => {
  lastbuzz.innerHTML = ``;
  socket.emit('resetclock')
});

pauseclock.addEventListener('click', () => {
  socket.emit('pauseclock')
});

startclock.addEventListener('click', () => {
  lastbuzz.innerHTML = ``;
  socket.emit('startclock')
});

addtime.addEventListener('click', () => {
  socket.emit('addtime')
});

subtime.addEventListener('click', () => {
  socket.emit('subtime')
});

resetscores.addEventListener('click', () => {
  lastbuzz.innerHTML = ``;
  socket.emit('resetscores')
});

// TODO: Key presses
