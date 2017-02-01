(function () {
  'use strict';

  angular
    .module('likes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('likes', {
        abstract: true,
        url: '/likes',
        template: '<ui-view/>'
      })
      .state('likes.list', {
        url: '',
        templateUrl: '/modules/likes/client/views/list-likes.client.view.html',
        controller: 'LikesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Likes List'
        }
      })
      .state('likes.view', {
        url: '/:likeId',
        templateUrl: '/modules/likes/client/views/view-like.client.view.html',
        controller: 'LikesController',
        controllerAs: 'vm',
        resolve: {
          likeResolve: getLike
        },
        data: {
          pageTitle: 'Like {{ likeResolve.title }}'
        }
      });
  }

  getLike.$inject = ['$stateParams', 'LikesService'];

  function getLike($stateParams, LikesService) {
    return LikesService.get({
      likeId: $stateParams.likeId
    }).$promise;
  }
}());
