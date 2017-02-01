(function (app) {
  'use strict';

  app.registerModule('comments', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('comments.admin', ['core.admin']);
  app.registerModule('comments.admin.routes', ['core.admin.routes']);
  app.registerModule('comments.services');
  app.registerModule('comments.routes', ['ui.router', 'core.routes', 'comments.services']);
}(ApplicationConfiguration));
