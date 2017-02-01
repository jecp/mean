'use strict';

describe('Subjects E2E Tests:', function () {
  describe('Test subjects page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/subjects');
      expect(element.all(by.repeater('subject in subjects')).count()).toEqual(0);
    });
  });
});
