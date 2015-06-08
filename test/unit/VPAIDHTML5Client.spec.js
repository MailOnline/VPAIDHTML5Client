'use strict';

var VPAIDHTML5Client = require('../../js/VPAIDHTML5Client');

describe('VPAIDHTML5Client.js api', function()  {
    var url = 'http://hello.com/';
    var frameConfig = {origin: '*', allowed: ['*']};
    var el;

    beforeEach(function () {
        el = document.createElement('div');
    });

    it('must exist', function () {
        assert.isFunction(VPAIDHTML5Client, 'must be a function');
    });
    it('must implement getID', function () {
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);
        assert.isFunction(vpaid.getID, 'must be a function');
        assert.equal(vpaid.getID(), 'vpaidIframe_0');
    });
    it('must implement loadAdUnit', function () {
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);
        assert.isFunction(vpaid.loadAdUnit, 'must be a function');
    });
    it('must implement unLoadAdUnit', function () {
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);
        assert.isFunction(vpaid.unloadAdUnit, 'must be a function');
    });
    it('must implement destroy', function () {
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);
        assert.isFunction(vpaid.destroy, 'must be a function');
    });
    it('must implement isDestroyed', function () {
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);
        assert.isFunction(vpaid.isDestroyed, 'must be a function');
        assert(!vpaid.isDestroyed());
        vpaid.destroy();
        assert(vpaid.isDestroyed());
    });
});

