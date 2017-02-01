'use strict';

describe('Likes E2E Tests:', function () {
  describe('Test likes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/likes');
      expect(element.all(by.repeater('like in likes')).count()).toEqual(0);
    });
  });
});
