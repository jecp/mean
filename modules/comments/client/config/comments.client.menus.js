(function () {
  'use strict';

  angular
    .module('comments')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '评论',
      state: 'comments',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'comments', {
      title: '评论列表',
      state: 'comments.list',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'comments', {
      title: '新建评论',
      state: 'comments.create',
      roles: ['*']
    });
  }
}());
