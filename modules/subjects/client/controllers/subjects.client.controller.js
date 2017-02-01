(function () {
  'use strict';

  angular
    .module('subjects')
    .controller('SubjectsController', SubjectsController);

  SubjectsController.$inject = ['$scope', '$state', '$window', 'subjectResolve', 'Authentication', 'Notification'];

  function SubjectsController($scope, $state, $window, subject, Authentication, Notification) {
    var vm = this;

    vm.subject = subject;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.comment = vm.form.comment;

    // Remove existing Subject
    function remove() {
      if ($window.confirm('确认删除?')) {
        vm.subject.$remove(function() {
          $state.go('subjects.list');
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
        $state.go('subjects.view', { subjectId: res._id }); // should we send the User to the list or the updated Subject's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Subject saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Subject save error!' });
      }
    }
  }
}());
