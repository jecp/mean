(function () {
  'use strict';

  describe('Forums Route Tests', function () {
    // Initialize global variables
    var $scope,
      ForumsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ForumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ForumsService = _ForumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.forums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/forums');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.forums.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/forums/client/views/admin/list-forums.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ForumsAdminController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.forums.create');
          $templateCache.put('/modules/forums/client/views/admin/form-forum.client.view.html', '');

          // Create mock forum
          mockForum = new ForumsService();

          // Initialize Controller
          ForumsAdminController = $controller('ForumsAdminController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/forums/create');
        }));

        it('should attach an forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
          expect($scope.vm.forum._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/forums/client/views/admin/form-forum.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ForumsAdminController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.forums.edit');
          $templateCache.put('/modules/forums/client/views/admin/form-forum.client.view.html', '');

          // Create mock forum
          mockForum = new ForumsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Forum about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ForumsAdminController = $controller('ForumsAdminController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:forumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            forumId: 1
          })).toEqual('/admin/forums/1/edit');
        }));

        it('should attach an forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/forums/client/views/admin/form-forum.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
