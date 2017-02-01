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
          mainstate = $state.get('forums');
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
          liststate = $state.get('forums.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/forums/client/views/list-forums.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ForumsController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('forums.view');
          $templateCache.put('/modules/forums/client/views/view-forum.client.view.html', '');

          // create mock forum
          mockForum = new ForumsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Forum about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ForumsController = $controller('ForumsController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:forumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            forumId: 1
          })).toEqual('/forums/1');
        }));

        it('should attach an forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/forums/client/views/view-forum.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/forums/client/views/list-forums.client.view.html', '');

          $state.go('forums.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('forums/');
          $rootScope.$digest();

          expect($location.path()).toBe('/forums');
          expect($state.current.templateUrl).toBe('/modules/forums/client/views/list-forums.client.view.html');
        }));
      });
    });
  });
}());
