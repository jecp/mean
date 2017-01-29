(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  //   menuService.addMenuItem('topbar', {
  //     title: '公告',
  //     state: 'articles',
  //     type: 'dropdown',
  //     roles: ['*']
  //   });

  //   // Add the dropdown list item
  //   menuService.addSubMenuItem('topbar', 'articles', {
  //     title: '公告列表',
  //     state: 'articles.list',
  //     roles: ['*']
  //   });
  }
}());
