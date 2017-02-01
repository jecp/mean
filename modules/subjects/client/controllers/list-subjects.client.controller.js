(function () {
  'use strict';

  angular
    .module('subjects')
    .controller('SubjectsListController', SubjectsListController);

  SubjectsListController.$inject = ['SubjectsService'];

  function SubjectsListController(SubjectsService) {
    var vm = this;

    vm.subjects = SubjectsService.query();
  }
}());
