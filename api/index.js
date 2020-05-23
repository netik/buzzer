const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);
const log = require('npmlog-ts')

const title = 'Dirty Talk Game Show'
const timeStep = 5;

// module configuration
app.disable('x-powered-by');
log.timestamp = true

// zero out stats
var statObj = { 'connections' : 0,
		'connected' : 0,
		'invalid_hash' : 0,
		'msg_join' : 0,
		'msg_clear' : 0,
		'msg_buzz' : 0,
		'msg_subscribe' : 0,
		'msg_unsubscribe' : 0,
		'msg_disconnect' : 0,
		'msg_chat' : 0,
		'noauth' : 0,
		'uptime' : 0,
		'valid_hash' : 0 };

// trap exceptions. Safety 3rd! We'll abort after this.
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)})

// this map stores all user and gameplay data
let data = {
  users: new Map(),
  scores: new Map(), // userid -> score mapping
  lastbuzz: undefined, // last known buzzed in
  timeRemain: 60,
  clockRunning: false,
  lockout: true
}

// we start with a default of 60 seconds
// but this can be changed in game.
let maxTime = 60;

const getData = () => ({
  timeRemain: data.timeRemain,
  clockRunning: data.clockRunning,
  lockout: data.lockout,
  users: [...data.users],
  lastbuzz: data.lastbuzz
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))
app.get('/healthcheck', function(req, res){
  res.send('OK');
});
app.get('/status', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(statObj) + "\n");
});

io.on('connection', (socket) => {
  var clientIP = socket.request.connection.remoteAddress;
  log.info(`${clientIP} - (socket ${socket.id}) connected`);

  statObj.connections++;
  statObj.connected++;

  // these operations are coming from the socket to the
  // service
  socket.on('join', (user) => {
    statObj.msg_join++;

    data.users.set(socket.id, user);
    data.scores.set(socket.id, 0);

    // it's not possible to transmit maps so we have to marshall them into a string, and then array...
    let transitString = JSON.stringify(Array.from(data.users));
    // tell them it worked
    socket.emit('joined', user);
    // tell everyone
    io.emit('active', transitString);
    log.info(`${socket.id}: ${user.name} joined!`)

    // update this user on the current world-state
    socket.emit('lockout', data.lockout);
    socket.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
  })

  socket.on('buzz', (user) => {
    statObj.msg_buzz++;
    
    // lock everyone out and stop the clock
    data.lockout = true;
    data.clockRunning = false;

    io.emit('lockout', data.lockout);
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });

    data.lastbuzz = socket.id;
    io.emit('lastbuzz', { id: data.lastbuzz, name: data.users.get(socket.id).name });
    log.info(`${socket.id}: ${data.users.get(socket.id).name} buzzed in!`);
  })

  socket.on('clear', () => {
    statObj.msg_clear++;

    data.lastbuzz = undefined;
    io.emit('lastbuzz', data.lastbuzz)
    log.info(`Clear lastbuzz`)
  })

  socket.on('resetclock', () => {
    statObj.msg_resetclock++;

    data.timeRemain = maxTime;
    data.clockRunning = false;
    data.lockout = true;
    io.emit('lockout', data.lockout);

    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    log.info(`Reset Clock`)
  });

  socket.on('startclock', () => {
    statObj.msg_startclock++;

    if (data.timeRemain > 0) {
      data.clockRunning = true;
      data.lockout = false;
      io.emit('lockout', data.lockout);
    }

    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    log.info(`Start clock with ${data.timeRemain}`);
  });
 
  socket.on('addtime', () => {
    statObj.msg_addtime++;
    data.timeRemain = data.timeRemain + timeStep;
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    log.info(`Add time (+${timeStep}) - now ${data.timeRemain}`);
  });

  socket.on('subtime', () => {
    statObj.msg_subtime++;

    data.timeRemain = data.timeRemain - timeStep;
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    log.info(`Subtract time (-${timeStep}) - now ${data.timeRemain}`);
  });

  socket.on('pauseclock', () => {
    statObj.msg_stopclock++;
    data.clockRunning = false;
    data.lockout = true;
    io.emit('lockout', data.lockout);
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    log.info(`Pause clock with ${data.timeRemain}`);
  })

  socket.on('disconnect', function () {
    // user disconnected, remove them from our state
    statObj.connected--;
    statObj.msg_disconnect++;
    data.users.delete(socket.id);
    data.scores.delete(socket.id);
    
    let userTransit = JSON.stringify(Array.from(data.users));
    io.emit('active', userTransit);

    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scores', scoreTransit);

    log.info(`${socket.request.connection.remoteAddress} - (socket ${socket.id}) connected`);
  });


})

function fireTick() { 
  if (data.clockRunning) {
    data.timeRemain = data.timeRemain - 1;
    if (data.timeRemain <= 0) {
      data.timeRemain = 0;
      data.clockRunning = false;
      data.lockout = true;
      io.emit('lockout', data.lockout);
      io.emit('timesup',true);
    }
  }
  io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
}

// set up our clock routine, which will run forever.
const timer = setInterval(fireTick, 1000);

server.listen(8090, () => log.info('Listening on 8090'))
