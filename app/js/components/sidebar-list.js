import sidebarListTpl from '../partials/sidebar-list.html';

const ngModule = angular
  .module('ngChatSidebarList', [])
  .directive('sidebarList', function() {
    
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',
        listItems: '=',
        showIcon: '='
      },
      templateUrl: sidebarListTpl
    };
  });

export default ngModule.name;
