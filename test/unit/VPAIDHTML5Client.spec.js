'use strict';

var mockPostMessage = require('../testHelper').mockPostMessage;
var framePostMessage = require('../testHelper').framePostMessage;
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

    it('must call the callback when handshake is done', function (done) {
        var onLoad = sinon.spy(function () {
            assert(onLoad.calledOnce);
            assert.sameDeepMembers(onLoad.getCall(0).args, [null, 'success']);
            done();
        });
        var vpaid = new VPAIDHTML5Client(el, url, frameConfig, onLoad);
        framePostMessage({id: vpaid.getID(), type: 'event', typeDetail: 'vpaid_handshake', msg: [null, 'success']});
    });

    it('must implement loadAdUnit', function (done) {
        var onAdLoad = sinon.spy(function (err, adUnit) {
            assert(onAdLoad.calledOnce);
            assert.isNotNull(adUnit);
            done();
        });

        var vpaid = new VPAIDHTML5Client(el, url, frameConfig);

        mockPostMessage(vpaid._el, function() {
            framePostMessage({id: vpaid.getID(), type: 'method', typeDetail: 'loadAdUnit', callbackID: vpaid.getID() + '_0'});
        }, vpaid._frame);

        assert.isFunction(vpaid.loadAdUnit, 'must be a function');
        vpaid.loadAdUnit('http://someAd.com/', onAdLoad);
        framePostMessage({id: vpaid.getID(), type: 'event', typeDetail: 'vpaid_handshake', msg: [null, 'success']});
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

