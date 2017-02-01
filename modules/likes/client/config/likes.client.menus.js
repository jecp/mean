(function () {
  'use strict';

  angular
    .module('likes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '喜欢',
      state: 'likes',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'likes', {
      title: '喜欢列表',
      state: 'likes.list',
      roles: ['*']
    });
  }
}());
