(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource', '$log'];

  function ForumsService($resource, $log) {
    var Forum = $resource('/api/forums/:forumId', {
      forumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Forum.prototype, {
      createOrUpdate: function () {
        var forum = this;
        return createOrUpdate(forum);
      }
    });

    return Forum;

    function createOrUpdate(forum) {
      if (forum._id) {
        return forum.$update(onSuccess, onError);
      } else {
        return forum.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(forum) {
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
