(function () {
  'use strict';

  angular
    .module('likes.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.likes', {
        abstract: true,
        url: '/likes',
        template: '<ui-view/>'
      })
      .state('admin.likes.list', {
        url: '',
        templateUrl: '/modules/likes/client/views/admin/list-likes.client.view.html',
        controller: 'LikesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.likes.create', {
        url: '/create',
        templateUrl: '/modules/likes/client/views/admin/form-like.client.view.html',
        controller: 'LikesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          likeResolve: newLike
        }
      })
      .state('admin.likes.edit', {
        url: '/:likeId/edit',
        templateUrl: '/modules/likes/client/views/admin/form-like.client.view.html',
        controller: 'LikesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          likeResolve: getLike
        }
      });
  }

  getLike.$inject = ['$stateParams', 'LikesService'];

  function getLike($stateParams, LikesService) {
    return LikesService.get({
      likeId: $stateParams.likeId
    }).$promise;
  }

  newLike.$inject = ['LikesService'];

  function newLike(LikesService) {
    return new LikesService();
  }
}());
