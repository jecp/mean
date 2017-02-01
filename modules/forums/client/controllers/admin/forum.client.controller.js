(function () {
  'use strict';

  angular
    .module('forums.admin')
    .controller('ForumsAdminController', ForumsAdminController);

  ForumsAdminController.$inject = ['$scope', '$state', '$window', 'forumResolve', 'Authentication', 'Notification'];

  function ForumsAdminController($scope, $state, $window, forum, Authentication, Notification) {
    var vm = this;

    vm.forum = forum;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Forum
    function remove() {
      if ($window.confirm('确认删除?')) {
        vm.forum.$remove(function() {
          $state.go('admin.forums.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Forum deleted successfully!' });
        });
      }
    }

    // Save Forum
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.forumForm');
        return false;
      }

      // Create a new forum, or update the current instance
      vm.forum.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.forums.list'); // should we send the User to the list or the updated Forum's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Forum saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Forum save error!' });
      }
    }
  }
}());
