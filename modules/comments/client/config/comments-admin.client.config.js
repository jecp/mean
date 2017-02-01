(function () {
  'use strict';

  // Configuring the Comments Admin module
  angular
    .module('comments.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: '管理评论',
      state: 'admin.comments.list'
    });
  }
}());
