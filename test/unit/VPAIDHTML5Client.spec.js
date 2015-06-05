'use strict';

var VPAIDHTML5Client = require('../../js/VPAIDHTML5Client');

describe('VPAIDHTML5Client.js api', function()  {
    it('must exist', function () {
        assert.isFunction(VPAIDHTML5Client, 'must be a function');
    });
    it('must implement loadAdUnit', function () {
        var vpaid = new VPAIDHTML5Client();
        assert.isFunction(vpaid.loadAdUnit, 'must be a function');
    });
    it('must implement unLoadAdUnit', function () {
        var vpaid = new VPAIDHTML5Client();
        assert.isFunction(vpaid.unloadAdUnit, 'must be a function');
    });
    it('must implement destroy', function () {
        var vpaid = new VPAIDHTML5Client();
        assert.isFunction(vpaid.destroy, 'must be a function');
    });
    it('must implement isDestroyed', function () {
        var vpaid = new VPAIDHTML5Client();
        assert.isFunction(vpaid.isDestroyed, 'must be a function');
        assert(!vpaid.isDestroyed());
        vpaid.destroy();
        assert(vpaid.isDestroyed());
    });
});

