const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const session = require('express-session');

const app = express();
const server = http.Server(app);
const io = socketio(server);
const log = require('npmlog-ts')

const expressWinston = require('express-winston');
const serviceLogger = require('./util/service_logger');
const logger = serviceLogger.logger('api');

const Redis = require('redis');
const RedisStore = require('connect-redis')(session);

// Redis Client instance for sessions ----------------------
let redisClient = Redis.createClient({
  host: 'localhost',
  port: 6379
});

global.logger = logger;

// set up the logger
app.use(
  expressWinston.logger({
    winstonInstance: logger
  })
);

const sessionConfig = {
  name: 'buzzid',
  secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'secret',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    client: redisClient,
    ttl: 5*24*60*60 // should always match the cookie maxAge (in seconds)
  }),
  cookie: {
    httpOnly: true,
    path: '/',
    secure: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'),
    maxAge: 5*24*60*60 * 1000
  }
};

// setup sessions
const sessionMiddleware = session(sessionConfig);

// setup 
const title = 'gobuzzyourself'

// app configuration
// the number of seconds to step the clock up or down when the host changes the time
const timeStep = 5;

// module configuration 
app.disable('x-powered-by');

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
    'msg_getscores' : 0,
    'msg_resetscores' : 0,
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

// setup sessions

// Use express-session middleware for express
app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// set up cors
app.use(function(req, res, next) {
  // wide open for now
  if (process.env.NODE_ENV === 'production') {
    res.header("Access-Control-Allow-Origin", "gobuzzyourself-web.herokuapp.com");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  };

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'))
app.set('view engine', 'pug')

if (process.env.NODE_ENV === 'production') { 
    app.get('/', (req, res) => res.redirect(301, 'https://gobuzzyourself-web.herokuapp.com/'));
} else {
    app.get('/', (req, res) => res.send('Please use an API client to talk to this server.'));
}

//app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())));

app.get('/healthcheck', function(req, res){
  res.send('OK');
});
 
app.get('/mysession', function(req, res) {
  res.send(req.session.id);
});

app.get('/status', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(statObj) + "\n");
});

io.on('connection', (socket) => {
  var clientIP = socket.request.connection.remoteAddress;
  global.logger.info(`${clientIP} - (socket ${socket.id} / session ${socket.request.session.id}) connected`);
  
  // update a counter for a test.
  const session = socket.request.session;

  // this connection counter is primarily for debugging only.
  if (! session.connections) { session.connections = 0; }
  session.connections++;
  session.save();

  statObj.connections++;
  statObj.connected++;

  // these operations are coming from the socket to the
  // service
  socket.on('join', (user) => {
    statObj.msg_join++;

    data.users.set(socket.id, user);
    data.scores.set(socket.id, { name: user.name, score: 0 });

    // tell them it worked
    socket.emit('joined', user);

    // tell everyone else who is here
    global.logger.info(`${socket.id}: ${user.name} joined!`)
    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scoreupdate', scoreTransit);

    // update this user on the current world-state
    socket.emit('lockout', data.lockout);
    socket.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
  })

  socket.on('buzz', (user) => {
    statObj.msg_buzz++;
    
    // there is a potential race condition here where someone buzzes in 
    // and we don't have data for them, like after a restart.
    const theUser = data.users.get(socket.id);
    if (!theUser) {
      log.error(`invalid socket id on buzz ${socket.id}`);
      return;
    }

    // debounce
    if (data.lastbuzz == socket.id) {
      global.logger.info(`${socket.id}: drop duplicate buzz`);
      return;
    }

    // lock everyone out and stop the clock
    data.lockout = true;
    data.clockRunning = false;

    io.emit('lockout', data.lockout);
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });

    data.lastbuzz = socket.id;
    io.emit('lastbuzz', { id: data.lastbuzz, name: data.users.get(socket.id).name });
    global.logger.info(`${socket.id}: ${data.users.get(socket.id).name} buzzed in!`);
  })

  socket.on('getscores', () => {
    statObj.msg_getscores++;
    // for right now this message sends everyone the scores.
    let transitString = JSON.stringify(Array.from(data.scores));
    socket.emit('scoreupdate', transitString);
  });

  socket.on('clear', () => {
    statObj.msg_clear++;

    data.lastbuzz = undefined;
    io.emit('lastbuzz', data.lastbuzz)
    global.logger.info(`Clear lastbuzz`)
  })

  socket.on('resetclock', () => {
    statObj.msg_resetclock++;

    data.timeRemain = maxTime;
    data.clockRunning = false;
    data.lockout = true;
    io.emit('lockout', data.lockout);
    data.lastbuzz = undefined;
    io.emit('lastbuzz', data.lastbuzz)
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    global.logger.info(`Reset Clock`)
  });

  socket.on('resetscores', () => {
    statObj.msg_resetscores++;

    for (let elem of data.scores.entries()) {
      elem[1].score = 0;
      data.scores.set(elem[0], elem[1]);
    }

    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scoreupdate', scoreTransit);
  });

  socket.on('startclock', () => {
    statObj.msg_startclock++;

    if (data.timeRemain > 0) {
      data.clockRunning = true;
      data.lockout = false;
      io.emit('lockout', data.lockout);
    }
    data.lastbuzz = undefined;
    io.emit('lastbuzz', data.lastbuzz)
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    global.logger.info(`Start clock with ${data.timeRemain}`);
  });
 
  socket.on('addtime', () => {
    statObj.msg_addtime++;
    data.timeRemain = data.timeRemain + timeStep;
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    global.logger.info(`Add time (+${timeStep}) - now ${data.timeRemain}`);
  });

  socket.on('subtime', () => {
    statObj.msg_subtime++;

    data.timeRemain = data.timeRemain - timeStep;
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    global.logger.info(`Subtract time (-${timeStep}) - now ${data.timeRemain}`);
  });

  socket.on('pauseclock', () => {
    statObj.msg_stopclock++;
    data.clockRunning = false;
    data.lockout = true;
    io.emit('lockout', data.lockout);
    io.emit('tick', { timeRemain: data.timeRemain, clockRunning: data.clockRunning });
    global.logger.info(`Pause clock with ${data.timeRemain}`);
  })

  socket.on('scoreup', (id) => {
    let oldobj = data.scores.get(id);
    if (!oldobj) { 
      global.logger.info(`scoreup: can't find ${id}`);
      return 
    }
    data.scores.set(id, { 
      name: oldobj.name,
      score: oldobj.score + 1 
    });

    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scoreupdate', scoreTransit);
  });
  
  socket.on('scoredown', (id) => {
    let oldobj = data.scores.get(id);
    if (!oldobj) { 
      global.logger.info(`scoredown: can't find ${id}`);
      return 
    }

    data.scores.set(id, { 
      name: oldobj.name,
      score: oldobj.score - 1 
    });
    
    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scoreupdate', scoreTransit);
  });
  
  socket.on('disconnect', function () {
    // user disconnected, remove them from our state
    statObj.connected--;
    statObj.msg_disconnect++;
    data.users.delete(socket.id);
    data.scores.delete(socket.id);
    
    let scoreTransit = JSON.stringify(Array.from(data.scores));
    io.emit('scoreupdate', scoreTransit);

    global.logger.info(`${socket.request.connection.remoteAddress} - (socket ${socket.id} / session ${socket.request.session.id}) disconnected`);
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
const port = process.env.PORT ? process.env.PORT : 8090;

server.listen(port, () => global.logger.info(`Listening on TCP port ${port}`))

