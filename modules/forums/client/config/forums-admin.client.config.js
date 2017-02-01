(function () {
  'use strict';

  // Configuring the Forums Admin module
  angular
    .module('forums.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: '管理论坛',
      state: 'admin.forums.list'
    });
  }
}());
