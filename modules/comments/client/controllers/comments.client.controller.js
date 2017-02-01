(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsController', CommentsController);

  CommentsController.$inject = ['$scope', '$state', '$window', 'commentResolve', 'Authentication', 'Notification'];

  function CommentsController($scope, $state, $window, comment, Authentication, Notification) {
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
          $state.go('comments.list');
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
        $state.go('comments.list'); // should we send the User to the list or the updated Comment's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Comment saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment save error!' });
      }
    }
  }
}());
