(function () {
  'use strict';

  angular
    .module('likes')
    .controller('LikesController', LikesController);

  LikesController.$inject = ['$scope', 'likeResolve', 'Authentication'];

  function LikesController($scope, like, Authentication) {
    var vm = this;

    vm.like = like;
    vm.authentication = Authentication;

  }
}());
