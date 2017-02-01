(function () {
  'use strict';

  angular
    .module('subjects.services')
    .factory('SubjectsService', SubjectsService);

  SubjectsService.$inject = ['$resource', '$log'];

  function SubjectsService($resource, $log) {
    var Subject = $resource('/api/subjects/:subjectId', {
      subjectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Subject.prototype, {
      createOrUpdate: function () {
        var subject = this;
        return createOrUpdate(subject);
      }
    });

    return Subject;

    function createOrUpdate(subject) {
      if (subject._id) {
        return subject.$update(onSuccess, onError);
      } else {
        return subject.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(subject) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
