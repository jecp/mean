(function () {
  'use strict';

  describe('Likes Admin Controller Tests', function () {
    // Initialize global variables
    var LikesAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      LikesService,
      mockLike,
      Notification;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _LikesService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      LikesService = _LikesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock like
      mockLike = new LikesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Like about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Likes controller.
      LikesAdminController = $controller('LikesAdminController as vm', {
        $scope: $scope,
        likeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleLikePostData;

      beforeEach(function () {
        // Create a sample like object
        sampleLikePostData = new LikesService({
          title: 'An Like about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.like = sampleLikePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (LikesService) {
        // Set POST response
        $httpBackend.expectPOST('/api/likes', sampleLikePostData).respond(mockLike);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Like saved successfully!' });
        // Test URL redirection after the like was created
        expect($state.go).toHaveBeenCalledWith('admin.likes.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/likes', sampleLikePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Like save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock like in $scope
        $scope.vm.like = mockLike;
      });

      it('should update a valid like', inject(function (LikesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/likes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Like saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.likes.list');
      }));

      it('should  call Notification.error if error', inject(function (LikesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/likes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Like save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup likes
        $scope.vm.like = mockLike;
      });

      it('should delete the like and redirect to likes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/likes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Like deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.likes.list');
      });

      it('should should not delete the like and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
