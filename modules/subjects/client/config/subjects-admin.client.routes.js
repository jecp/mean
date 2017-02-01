(function () {
  'use strict';

  angular
    .module('subjects.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.subjects', {
        abstract: true,
        url: '/subjects',
        template: '<ui-view/>'
      })
      .state('admin.subjects.list', {
        url: '',
        templateUrl: '/modules/subjects/client/views/admin/list-subjects.client.view.html',
        controller: 'SubjectsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.subjects.create', {
        url: '/create',
        templateUrl: '/modules/subjects/client/views/admin/form-subject.client.view.html',
        controller: 'SubjectsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          subjectResolve: newSubject
        }
      })
      .state('admin.subjects.edit', {
        url: '/:subjectId/edit',
        templateUrl: '/modules/subjects/client/views/admin/form-subject.client.view.html',
        controller: 'SubjectsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          subjectResolve: getSubject
        }
      });
  }

  getSubject.$inject = ['$stateParams', 'SubjectsService'];

  function getSubject($stateParams, SubjectsService) {
    return SubjectsService.get({
      subjectId: $stateParams.subjectId
    }).$promise;
  }

  newSubject.$inject = ['SubjectsService'];

  function newSubject(SubjectsService) {
    return new SubjectsService();
  }
}());
