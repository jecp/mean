(function () {
  'use strict';

  angular
    .module('forums.admin')
    .controller('ForumsAdminListController', ForumsAdminListController);

  ForumsAdminListController.$inject = ['ForumsService'];

  function ForumsAdminListController(ForumsService) {
    var vm = this;

    vm.forums = ForumsService.query();
  }
}());
