(function () {
  'use strict';

  angular
    .module('likes.admin')
    .controller('LikesAdminListController', LikesAdminListController);

  LikesAdminListController.$inject = ['LikesService'];

  function LikesAdminListController(LikesService) {
    var vm = this;

    vm.likes = LikesService.query();
  }
}());
