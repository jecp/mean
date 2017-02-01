(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('articles.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: '管理文章',
      state: 'admin.articles.list'
    });
  }
}());
