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
          mainstate = $state.get('admin.comments');
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
          liststate = $state.get('admin.comments.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/comments/client/views/admin/list-comments.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CommentsAdminController,
          mockComment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.comments.create');
          $templateCache.put('/modules/comments/client/views/admin/form-comment.client.view.html', '');

          // Create mock comment
          mockComment = new CommentsService();

          // Initialize Controller
          CommentsAdminController = $controller('CommentsAdminController as vm', {
            $scope: $scope,
            commentResolve: mockComment
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.commentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/comments/create');
        }));

        it('should attach an comment to the controller scope', function () {
          expect($scope.vm.comment._id).toBe(mockComment._id);
          expect($scope.vm.comment._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/comments/client/views/admin/form-comment.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CommentsAdminController,
          mockComment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.comments.edit');
          $templateCache.put('/modules/comments/client/views/admin/form-comment.client.view.html', '');

          // Create mock comment
          mockComment = new CommentsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Comment about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CommentsAdminController = $controller('CommentsAdminController as vm', {
            $scope: $scope,
            commentResolve: mockComment
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:commentId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.commentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            commentId: 1
          })).toEqual('/admin/comments/1/edit');
        }));

        it('should attach an comment to the controller scope', function () {
          expect($scope.vm.comment._id).toBe(mockComment._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/comments/client/views/admin/form-comment.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
