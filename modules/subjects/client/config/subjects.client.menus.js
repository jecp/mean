(function () {
  'use strict';

  angular
    .module('subjects')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '主题',
      state: 'subjects',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'subjects', {
      title: '主题列表',
      state: 'subjects.list',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'subjects', {
      title: '新建主题',
      state: 'subjects.create',
      roles: ['*']
    });
  }
}());
