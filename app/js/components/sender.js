import senderTpl from '../partials/sender.html';

const SenderCtrl = ($scope) => {
  $scope.chatMessage = null;

  $scope.send = function ($form) {

    if (!$form.$valid) {
      $form.$submitted = true;
      return;
    }

    this.message = $scope.chatMessage;
    this.onSend({ $message: this.message });

    $scope.chatMessage = null;
    $form.$submitted = false;
  };

};

const ngModule = angular
  .module('ngChatSender', ['ngMessages'])
  .directive('sender', function () {
    return {
      restrict: 'E',
      require: 'ngModel',
      transclude: true,
      scope: {
        message: '=',
        welcomeMessage: '=',
        chatHistory: '=',
        onSend: '&'
      },
      controller: ['$scope', SenderCtrl],
      templateUrl: senderTpl
    };
  });

export default ngModule.name;