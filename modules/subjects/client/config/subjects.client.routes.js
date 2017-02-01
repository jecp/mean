(function () {
  'use strict';

  angular
    .module('subjects.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('subjects', {
        abstract: true,
        url: '/subjects',
        template: '<ui-view/>'
      })
      .state('subjects.list', {
        url: '',
        templateUrl: '/modules/subjects/client/views/list-subjects.client.view.html',
        controller: 'SubjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Subjects List'
        }
      })
      .state('subjects.create', {
        url: '/create',
        templateUrl: '/modules/subjects/client/views/admin/form-subject.client.view.html',
        controller: 'SubjectsController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          subjectResolve: newSubject
        }
      })
      .state('subjects.view', {
        url: '/:subjectId',
        templateUrl: '/modules/subjects/client/views/view-subject.client.view.html',
        controller: 'SubjectsController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: getSubject
        },
        data: {
          pageTitle: 'Subject {{ subjectResolve.title }}'
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
