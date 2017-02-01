(function () {
  'use strict';

  describe('Likes Route Tests', function () {
    // Initialize global variables
    var $scope,
      LikesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LikesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LikesService = _LikesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('likes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/likes');
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
          liststate = $state.get('likes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/likes/client/views/list-likes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          LikesController,
          mockLike;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('likes.view');
          $templateCache.put('/modules/likes/client/views/view-like.client.view.html', '');

          // create mock like
          mockLike = new LikesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Like about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          LikesController = $controller('LikesController as vm', {
            $scope: $scope,
            likeResolve: mockLike
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:likeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.likeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            likeId: 1
          })).toEqual('/likes/1');
        }));

        it('should attach an like to the controller scope', function () {
          expect($scope.vm.like._id).toBe(mockLike._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/likes/client/views/view-like.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/likes/client/views/list-likes.client.view.html', '');

          $state.go('likes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('likes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/likes');
          expect($state.current.templateUrl).toBe('/modules/likes/client/views/list-likes.client.view.html');
        }));
      });
    });
  });
}());
