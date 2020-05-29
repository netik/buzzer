const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const clock = document.querySelector('.js-clock')
const lastbuzz = document.querySelector('.js-lastbuzz');

let user = {};

const getUserInfo = () => {
  user = JSON.parse(sessionStorage.getItem('user')) || {}
  if (user.name) {
    form.querySelector('[name=name]').value = user.name
  }
  if (user.team) {
    form.querySelector('[name=team]').value = user.team 
  }
};

const saveUserInfo = () => {
  sessionStorage.setItem('user', JSON.stringify(user))
};

form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.name = form.querySelector('[name=name]').value;
//  user.team = form.querySelector('[name=team]').value;

  socket.emit('join', user);
  saveUserInfo();
  joinedInfo.innerText = `${user.name}`;
  form.classList.add('hidden');
  joined.classList.remove('hidden');
  body.classList.add('buzzer-mode');
});

buzzer.addEventListener('click', (e) => {
  socket.emit('buzz', user);
});

socket.on('tick', (data) => {
  const min = `${Math.floor(data.timeRemain / 60)}`;
  const sec = `${data.timeRemain - (min*60)}`;

  clock.innerText = `${min.padStart(2,'0')}:${sec.padStart(2,'0')}`; 
});

socket.on('lockout', (data) => {
  if (data) {
    buzzer.disabled = true;
  } else {
    buzzer.disabled = false;
  }
});

socket.on('lastbuzz', (buzz) => {
  if (buzz !== null) {
    lastbuzz.innerHTML = `${buzz.name} buzzed in first!`;
  } else {
    // this is a clear request
    lastbuzz.innerHTML = '';
  }
});

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
});

getUserInfo();
