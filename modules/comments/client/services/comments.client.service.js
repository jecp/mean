(function () {
  'use strict';

  angular
    .module('comments.services')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource', '$log'];

  function CommentsService($resource, $log) {
    var Comment = $resource('/api/comments/:commentId', {
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Comment.prototype, {
      createOrUpdate: function () {
        var comment = this;
        // console.log('subject is: ' + $scope.subject);
        return createOrUpdate(comment);
      }
    });

    return Comment;

    function createOrUpdate(comment) {
      console.log(comment);
      if (comment._id) {
        return comment.$update(onSuccess, onError);
      } else {
        return comment.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(comment) {
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
