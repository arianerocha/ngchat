import senderDirective from './sender';
import sidebarListDirective from './sidebar-list';
import nicknameDirective from './nickname';

export default angular
  .module('ngChatComponents', [
    senderDirective,
    nicknameDirective,
    sidebarListDirective,
  ]).name;
