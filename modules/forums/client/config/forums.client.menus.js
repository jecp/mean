(function () {
  'use strict';

  angular
    .module('forums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '论坛',
      state: 'forums',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'forums', {
      title: '论坛列表',
      state: 'forums.list',
      roles: ['*']
    });
  }
}());
