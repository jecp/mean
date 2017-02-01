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
          mainstate = $state.get('admin.likes');
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
          liststate = $state.get('admin.likes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/likes/client/views/admin/list-likes.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LikesAdminController,
          mockLike;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.likes.create');
          $templateCache.put('/modules/likes/client/views/admin/form-like.client.view.html', '');

          // Create mock like
          mockLike = new LikesService();

          // Initialize Controller
          LikesAdminController = $controller('LikesAdminController as vm', {
            $scope: $scope,
            likeResolve: mockLike
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.likeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/likes/create');
        }));

        it('should attach an like to the controller scope', function () {
          expect($scope.vm.like._id).toBe(mockLike._id);
          expect($scope.vm.like._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/likes/client/views/admin/form-like.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LikesAdminController,
          mockLike;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.likes.edit');
          $templateCache.put('/modules/likes/client/views/admin/form-like.client.view.html', '');

          // Create mock like
          mockLike = new LikesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Like about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          LikesAdminController = $controller('LikesAdminController as vm', {
            $scope: $scope,
            likeResolve: mockLike
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:likeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.likeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            likeId: 1
          })).toEqual('/admin/likes/1/edit');
        }));

        it('should attach an like to the controller scope', function () {
          expect($scope.vm.like._id).toBe(mockLike._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/likes/client/views/admin/form-like.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
