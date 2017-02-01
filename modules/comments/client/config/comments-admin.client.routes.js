(function () {
  'use strict';

  angular
    .module('comments.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.comments', {
        abstract: true,
        url: '/comments',
        template: '<ui-view/>'
      })
      .state('admin.comments.list', {
        url: '',
        templateUrl: '/modules/comments/client/views/admin/list-comments.client.view.html',
        controller: 'CommentsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.comments.create', {
        url: '/create',
        templateUrl: '/modules/comments/client/views/admin/form-comment.client.view.html',
        controller: 'CommentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          commentResolve: newComment
        }
      })
      .state('admin.comments.edit', {
        url: '/:commentId/edit',
        templateUrl: '/modules/comments/client/views/admin/form-comment.client.view.html',
        controller: 'CommentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          commentResolve: getComment
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
