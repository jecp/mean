(function () {
  'use strict';

  angular
    .module('subjects.admin')
    .controller('SubjectsAdminListController', SubjectsAdminListController);

  SubjectsAdminListController.$inject = ['SubjectsService'];

  function SubjectsAdminListController(SubjectsService) {
    var vm = this;

    vm.subjects = SubjectsService.query();
  }
}());
