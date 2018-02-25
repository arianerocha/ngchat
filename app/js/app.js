import ioService from './io';
import ngChatComponents from './components';

import '../assets/sass/theme.scss';

const ngModule = angular.module('ngChatApp', [
  'ngMessages',
  ioService,
  ngChatComponents
]).

run(function(io) {
  io.init({
    ioServer: 'http://localhost:3696',
  });
}).

controller('MainController', function($scope, io) {
  $scope.updates = [];
  $scope.messages = [];
  $scope.users = [];

  $scope.send = ($message) => {
    $scope.message = $message;
    io.emit({
      message: $scope.message,
    });

    $scope.message = null;
  };

  $scope.changeNickname = ($nickname) => {
    $scope.nickname = $nickname;
    io.emitChangeNickname({
      nickname: $scope.nickname,
    });

    $scope.nickname = null;
  };

  io.watch('currentUser', function(user) {
    $scope.nickname = user;
    $scope.$apply();
  });

  io.watch('message', function(data) {
    $scope.messages.push(data);
    $scope.$apply();
  });

  io.watch('lastActivities', function({ message, user }) {
    $scope.updates.push({
      user,
      message,
    });
    $scope.$apply();
  });

  io.watch('updateUsers', function() {
    let clients = io.getClientsConnected();
    $scope.users = clients.map((item) => {
      return { user: item };
    });

    $scope.$apply();
  });
});


export default ngModule.name;
