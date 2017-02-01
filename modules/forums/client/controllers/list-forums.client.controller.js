(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsListController', ForumsListController);

  ForumsListController.$inject = ['ForumsService'];

  function ForumsListController(ForumsService) {
    var vm = this;

    vm.forums = ForumsService.query();
  }
}());
