(function () {
  'use strict';

  angular
    .module('likes.services')
    .factory('LikesService', LikesService);

  LikesService.$inject = ['$resource', '$log'];

  function LikesService($resource, $log) {
    var Like = $resource('/api/likes/:likeId', {
      likeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Like.prototype, {
      createOrUpdate: function () {
        var like = this;
        return createOrUpdate(like);
      }
    });

    return Like;

    function createOrUpdate(like) {
      if (like._id) {
        return like.$update(onSuccess, onError);
      } else {
        return like.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(like) {
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
