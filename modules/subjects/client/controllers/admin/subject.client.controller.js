(function () {
  'use strict';

  angular
    .module('subjects.admin')
    .controller('SubjectsAdminController', SubjectsAdminController);

  SubjectsAdminController.$inject = ['$scope', '$state', '$window', 'subjectResolve', 'Authentication', 'Notification'];

  function SubjectsAdminController($scope, $state, $window, subject, Authentication, Notification) {
    var vm = this;

    vm.subject = subject;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Subject
    function remove() {
      if ($window.confirm('确认删除?')) {
        vm.subject.$remove(function() {
          $state.go('admin.subjects.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Subject deleted successfully!' });
        });
      }
    }

    // Save Subject
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.subjectForm');
        return false;
      }

      // Create a new subject, or update the current instance
      vm.subject.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.subjects.list'); // should we send the User to the list or the updated Subject's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Subject saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Subject save error!' });
      }
    }
  }
}());
