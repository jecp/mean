(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '管理',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
}());
