(function () {
  'use strict';

  angular
    .module('comments.admin')
    .controller('CommentsAdminController', CommentsAdminController);

  CommentsAdminController.$inject = ['$scope', '$state', '$window', 'commentResolve', 'Authentication', 'Notification'];

  function CommentsAdminController($scope, $state, $window, comment, Authentication, Notification) {
    var vm = this;

    vm.comment = comment;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Comment
    function remove() {
      if ($window.confirm('确认删除?')) {
        vm.comment.$remove(function() {
          $state.go('admin.comments.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Comment deleted successfully!' });
        });
      }
    }

    // Save Comment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commentForm');
        return false;
      }

      // Create a new comment, or update the current instance
      vm.comment.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.comments.list'); // should we send the User to the list or the updated Comment's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Comment saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment save error!' });
      }
    }
  }
}());
