'use strict';
var unique = require('../../js/utils').unique('hello');
var VPAIDHTML5iFrame = require('../../js/VPAIDHTML5iFrame');

describe('VPAIDHTML5iFrame api', function () {
    var frameConfig = {origin: '*', allowed: ['*']};

    it('must exist', function () {
        assert.isFunction(VPAIDHTML5iFrame, 'must be a function');
    });

    it('must implement loadAdUnit', function () {
        var id = unique();
        var vpaidIframe = new VPAIDHTML5iFrame(id, frameConfig);
        assert.isFunction(vpaidIframe.loadAdUnit);
    });

    it('must implement unloadAdUnit', function () {
        var id = unique();
        var vpaidIframe = new VPAIDHTML5iFrame(id, frameConfig);
        assert.isFunction(vpaidIframe.unloadAdUnit);
    });
});

