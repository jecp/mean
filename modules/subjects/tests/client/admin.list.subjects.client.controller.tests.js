(function () {
  'use strict';

  describe('Admin Subjects List Controller Tests', function () {
    // Initialize global variables
    var SubjectsAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SubjectsService,
      mockSubject;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SubjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SubjectsService = _SubjectsService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/subjects/client/views/list-subjects.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock subject
      mockSubject = new SubjectsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Subject about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Subjects List controller.
      SubjectsAdminListController = $controller('SubjectsAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockSubjectList;

      beforeEach(function () {
        mockSubjectList = [mockSubject, mockSubject];
      });

      it('should send a GET request and return all subjects', inject(function (SubjectsService) {
        // Set POST response
        $httpBackend.expectGET('/api/subjects').respond(mockSubjectList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.subjects.length).toEqual(2);
        expect($scope.vm.subjects[0]).toEqual(mockSubject);
        expect($scope.vm.subjects[1]).toEqual(mockSubject);

      }));
    });
  });
}());
