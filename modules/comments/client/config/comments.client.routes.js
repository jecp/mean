(function () {
  'use strict';

  angular
    .module('comments.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('comments', {
        abstract: true,
        url: '/comments',
        template: '<ui-view/>'
      })
      .state('comments.list', {
        url: '',
        templateUrl: '/modules/comments/client/views/list-subject-comments.client.view.html',
        controller: 'CommentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Comments List'
        }
      })
      .state('comments.view', {
        url: '/:commentId',
        templateUrl: '/modules/comments/client/views/view-comment.client.view.html',
        controller: 'CommentsController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getComment
        },
        data: {
          pageTitle: 'Comment {{ commentResolve.title }}'
        }
      })
      .state('comments.create', {
        url: '/create',
        templateUrl: '/modules/comments/client/views/create-comment.client.view.html',
        controller: 'CommentsController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          commentResolve: newComment
        }
      });
  }

  getComment.$inject = ['$stateParams', 'CommentsService'];

  function getComment($stateParams, CommentsService) {
    return CommentsService.get({
      commentId: $stateParams.commentId
    }).$promise;
  }

  newComment.$inject = ['CommentsService'];

  function newComment(CommentsService) {
    return new CommentsService();
  }
}());
