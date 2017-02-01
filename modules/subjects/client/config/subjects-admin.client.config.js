(function () {
  'use strict';

  // Configuring the Subjects Admin module
  angular
    .module('subjects.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: '管理主题',
      state: 'admin.subjects.list'
    });
  }
}());
