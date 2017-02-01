(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', 'forumResolve', 'Authentication'];

  function ForumsController($scope, forum, Authentication) {
    var vm = this;

    vm.forum = forum;
    vm.authentication = Authentication;

  }
}());
