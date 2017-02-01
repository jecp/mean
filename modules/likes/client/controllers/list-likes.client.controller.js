(function () {
  'use strict';

  angular
    .module('likes')
    .controller('LikesListController', LikesListController);

  LikesListController.$inject = ['LikesService'];

  function LikesListController(LikesService) {
    var vm = this;

    vm.likes = LikesService.query();
  }
}());
