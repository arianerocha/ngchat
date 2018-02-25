import nicknameTpl from '../partials/nickname.html';

const NicknameCtrl = function($scope) {
  $scope.nickname = null;

  $scope.submit = function($form) {
    $form.$setPristine();
    $form.nickname.$setValidity('nickname', true);

    let freeNickname = $scope.users.find((item) => {
      return item.user === $scope.nickname;
    });

    if (freeNickname !== undefined && $scope.currentNickname !== $scope.nickname) {
      $form.nickname.$setValidity('nickname', false);
    }

    if ($form.$invalid) {
      $form.$submitted = true;
      return;
    }

    this.onChangeNickname({ $nickname: $scope.nickname });

    $scope.nickname = null;
    $form.$submitted = false;
  };

};

const ngModule = angular
  .module('ngChatNickname', ['ngMessages'])
  .directive('nickname', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        onChangeNickname: '&',
        currentNickname: '=',
        users: '='
      },
      templateUrl: nicknameTpl,
      controller: ['$scope', NicknameCtrl]
    };
  });

export default ngModule.name;
