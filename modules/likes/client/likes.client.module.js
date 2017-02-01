(function (app) {
  'use strict';

  app.registerModule('likes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('likes.admin', ['core.admin']);
  app.registerModule('likes.admin.routes', ['core.admin.routes']);
  app.registerModule('likes.services');
  app.registerModule('likes.routes', ['ui.router', 'core.routes', 'likes.services']);
}(ApplicationConfiguration));
