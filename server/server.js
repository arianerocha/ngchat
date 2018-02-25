var express = require('express');
var server = require('http').createServer(app);
var app = express();
var io = require('socket.io')(server);

var port = 3696;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

server.users = {};

io.on('connection', function(socket) {
  console.log('user connected...', socket.id);

  socket.events = {};

  socket.on('event.new-user', function() {
    server.users[socket.id] = socket;

    let payload = {
      users: Object.keys(server.users),
      user: socket.id,
      message: `User ${socket.id} has joined to Mini-Chat.`
    };

    socket.broadcast.emit('event.user-join-chat', payload);

    payload.message = 'You have joined to Mini-Chat.';
    socket.emit('event.welcome', payload);
  });

  socket.on('event.message', function(payload) {
    payload.user = socket.nickname || socket.id;
    payload.date = new Date();


    socket.broadcast.emit('event.response', payload);
    socket.emit('event.response', Object.assign({}, payload, {
      user: 'You',
    }));
  });

  socket.on('event.subscribe', function(room) {
    console.log('subscribing to', room);
    socket.join(room);
  });

  socket.on('event.unsubscribe', function(room) {
    console.log('unsubscribing to ', room);
    socket.leave(room);
  });

  socket.on('event.change-name', function(data) {
    let nickname = data.nickname;

    let key = socket.nickname || socket.id;

    delete server.users[key];

    let clients = Object.keys(server.users);

    socket.nickname = nickname;
    server.users[socket.nickname] = socket;

    clients.push(nickname);

    const payload = {
      message: `User ${ socket.id } changed his name to ${nickname}`,
      user: nickname,
      users: clients,
    };

    socket.emit('event.changed-name', Object.assign({}, payload, {
      message: `You change your name to ${nickname}`,
    }));

    socket.broadcast.emit('event.user-changed-name', payload);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected...');

    let key = socket.nickname || socket.id;

    delete server.users[key];

    io.emit('user disconnected...', {
      message: `User ${key} has left.`,
      user: key,
      users: Object.keys(server.users),
    });
  });

});


module.exports = server;
