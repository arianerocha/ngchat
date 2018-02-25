const ngModule = angular.module('io.service', []).
factory('io', function() {
  var socket,
    ioServer,
    ioRoom,
    users = {},
    watches = {};


  const addListener = function(eventName, callback) {
    socket.on(eventName, callback);
  };

  const handleUserActions = function(payload) {
    users = payload.users;

    watches['lastActivities'](payload);
    return watches['updateUsers']();
  };

  return {
    init: function(conf) {
      ioServer = conf.ioServer;
      ioRoom = conf.ioRoom;

      socket = io.connect(conf.ioServer);

      addListener('connect', function() {
        watches['currentUser'](socket.id);
        socket.emit('event.new-user');
      });

      addListener('event.welcome', handleUserActions);
      addListener('event.user-join-chat', handleUserActions);
      addListener('event.user-changed-name', handleUserActions);
      addListener('user disconnected...', handleUserActions);
      addListener('event.response', data => {
        if (data.room === ioRoom) {
          return watches['message'](data);
        }
      });

      addListener('event.changed-name', payload => {
        socket.nickname = payload.user;
        watches['currentUser'](socket.nickname);
        return handleUserActions(payload);
      });
    },

    subscribe: function() {
      socket.emit('event.subscribe', ioRoom);
    },

    emit: function(args) {
      socket.emit('event.message', {
        room: ioRoom,
        message: args.message,
      });
    },

    watch: function(item, data) {
      watches[item] = data;
    },

    unWatch: function(item) {
      delete watches[item];
    },

    getClientsConnected: function() {
      return users;
    },

    getCurrentUser: function(){
      return socket.nickname || socket.id;
    },

    emitChangeNickname: function(args) {
      socket.emit('event.change-name', {
        nickname: args.nickname,
      });
    }
  };
});

export default ngModule.name;
