(function () {
  'use strict';

  angular
    .module('likes.admin')
    .controller('LikesAdminController', LikesAdminController);

  LikesAdminController.$inject = ['$scope', '$state', '$window', 'likeResolve', 'Authentication', 'Notification'];

  function LikesAdminController($scope, $state, $window, like, Authentication, Notification) {
    var vm = this;

    vm.like = like;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Like
    function remove() {
      if ($window.confirm('确认删除?')) {
        vm.like.$remove(function() {
          $state.go('admin.likes.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Like deleted successfully!' });
        });
      }
    }

    // Save Like
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.likeForm');
        return false;
      }

      // Create a new like, or update the current instance
      vm.like.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.likes.list'); // should we send the User to the list or the updated Like's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Like saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Like save error!' });
      }
    }
  }
}());
