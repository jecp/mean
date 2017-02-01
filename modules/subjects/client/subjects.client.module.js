(function (app) {
  'use strict';

  app.registerModule('subjects', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('subjects.admin', ['core.admin']);
  app.registerModule('subjects.admin.routes', ['core.admin.routes']);
  app.registerModule('subjects.services');
  app.registerModule('subjects.routes', ['ui.router', 'core.routes', 'subjects.services']);
}(ApplicationConfiguration));
