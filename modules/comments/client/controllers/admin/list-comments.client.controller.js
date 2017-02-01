(function () {
  'use strict';

  angular
    .module('comments.admin')
    .controller('CommentsAdminListController', CommentsAdminListController);

  CommentsAdminListController.$inject = ['CommentsService'];

  function CommentsAdminListController(CommentsService) {
    var vm = this;

    vm.comments = CommentsService.query();
  }
}());
