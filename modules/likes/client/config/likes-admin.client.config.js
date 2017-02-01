(function () {
  'use strict';

  // Configuring the Likes Admin module
  angular
    .module('likes.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: '管理喜欢',
      state: 'admin.likes.list'
    });
  }
}());
