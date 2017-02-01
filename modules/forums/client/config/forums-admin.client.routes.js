(function () {
  'use strict';

  angular
    .module('forums.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.forums', {
        abstract: true,
        url: '/forums',
        template: '<ui-view/>'
      })
      .state('admin.forums.list', {
        url: '',
        templateUrl: '/modules/forums/client/views/admin/list-forums.client.view.html',
        controller: 'ForumsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.forums.create', {
        url: '/create',
        templateUrl: '/modules/forums/client/views/admin/form-forum.client.view.html',
        controller: 'ForumsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          forumResolve: newForum
        }
      })
      .state('admin.forums.edit', {
        url: '/:forumId/edit',
        templateUrl: '/modules/forums/client/views/admin/form-forum.client.view.html',
        controller: 'ForumsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          forumResolve: getForum
        }
      });
  }

  getForum.$inject = ['$stateParams', 'ForumsService'];

  function getForum($stateParams, ForumsService) {
    return ForumsService.get({
      forumId: $stateParams.forumId
    }).$promise;
  }

  newForum.$inject = ['ForumsService'];

  function newForum(ForumsService) {
    return new ForumsService();
  }
}());
