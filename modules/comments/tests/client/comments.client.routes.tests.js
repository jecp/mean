(function () {
  'use strict';

  describe('Comments Route Tests', function () {
    // Initialize global variables
    var $scope,
      CommentsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CommentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CommentsService = _CommentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('comments');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/comments');
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
          liststate = $state.get('comments.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/comments/client/views/list-comments.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CommentsController,
          mockComment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('comments.view');
          $templateCache.put('/modules/comments/client/views/view-comment.client.view.html', '');

          // create mock comment
          mockComment = new CommentsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Comment about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CommentsController = $controller('CommentsController as vm', {
            $scope: $scope,
            commentResolve: mockComment
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:commentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.commentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            commentId: 1
          })).toEqual('/comments/1');
        }));

        it('should attach an comment to the controller scope', function () {
          expect($scope.vm.comment._id).toBe(mockComment._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/comments/client/views/view-comment.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/comments/client/views/list-comments.client.view.html', '');

          $state.go('comments.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('comments/');
          $rootScope.$digest();

          expect($location.path()).toBe('/comments');
          expect($state.current.templateUrl).toBe('/modules/comments/client/views/list-comments.client.view.html');
        }));
      });
    });
  });
}());
