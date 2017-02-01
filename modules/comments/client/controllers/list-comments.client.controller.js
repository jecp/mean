(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['CommentsService'];

  function CommentsListController(CommentsService) {
    // console.log($location.url());
    var vm = this;
    console.log(vm);
    // var subject = $scope.subject;
    // console.log($scope.comment);

    // vm.comments = CommentsService.query();
    vm.comments = CommentsService.query();
  }
}());
