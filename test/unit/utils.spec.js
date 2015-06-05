'use strict';
var utils = require('../../js/utils');

describe('utils.js api', function () {
    it('must implement noop', function() {
        assert.isFunction(utils.noop);
    });

    it('must implement createIframe', function() {
        var url = 'http://hello.com/';
        assert.isFunction(utils.createIframe, 'must be a function', 'must be a function');
        assert.instanceOf(utils.createIframe(document.createElement('div'), url), HTMLElement, 'must return a HTMLElement');
        assert.equal(utils.createIframe(document.createElement('div'), url).src, url, 'must return a HTMLElement with the src used in the arguments');

        let parentElement = document.createElement('div');
        assert.equal(utils.createIframe(parentElement, url).parentElement, parentElement, 'must return a HTMLElement that is a child of the element used in the arguments');
    });

});

