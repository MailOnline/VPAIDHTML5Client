'use strict';

var noop = require('../testHelper').noop;
var framePostMessage = require('../testHelper').framePostMessage;
var VPAIDHTML5Client = require('../../js/VPAIDHTML5Client');

describe('VPAIDHTML5Client.js api', function()  {
    var el, video;

    beforeEach(function () {
        el = document.createElement('iframe');
        video = document.createElement('video');
        document.body.appendChild(el);
        document.body.appendChild(video);
    });

    afterEach(function () {
        document.body.removeChild(el);
        document.body.removeChild(video);
    });

    it('must exist', function () {
        assert.isFunction(VPAIDHTML5Client, 'must be a function');
    });

    it('must implement getID', function () {
        var vpaid = new VPAIDHTML5Client(el, video);
        assert.isFunction(vpaid.getID, 'must be a function');
        assert.equal(vpaid.getID(), 'vpaidIframe_0');
    });

    describe('loadAdUnit', function () {

        // it('must return adUnit', function (done) {
        //     var onAdLoad = sinon.spy(function (err, adUnit) {
        //         assert(onAdLoad.calledOnce);
        //         assert.isNull(err);
        //         assert.isNotNull(adUnit);
        //         done();
        //     });

        //     var vpaid = new VPAIDHTML5Client(el, video);

        //     assert.isFunction(vpaid.loadAdUnit, 'must be a function');
        //     vpaid.loadAdUnit('', onAdLoad);
        //     framePostMessage({id: vpaid.getID(), 'event': 'load'});
        // });

        it('must timeout', function (done) {
            var onAdLoad = sinon.spy(function (err, adUnit) {
                assert(onAdLoad.calledOnce);
                assert.isNotNull(err);
                assert.isNull(adUnit);
                done();
            });

            var vpaid = new VPAIDHTML5Client(el, video);

            assert.isFunction(vpaid.loadAdUnit, 'must be a function');
            vpaid.loadAdUnit('', onAdLoad);
        });
    });


    it('must implement unLoadAdUnit', function () {
        var vpaid = new VPAIDHTML5Client(el, video);
        assert.isFunction(vpaid.unloadAdUnit, 'must be a function');
    });

    describe('destroy', function () {
        it('must implement destroy', function () {
            var vpaid = new VPAIDHTML5Client(el, video);
            assert.isFunction(vpaid.destroy, 'must be a function');
        });

        it('must throw when destroyed', function() {
            var vpaid = new VPAIDHTML5Client(el, video);

            assert.isFunction(vpaid.destroy, 'must be a function');
            vpaid.destroy();

            assert.throw(vpaid.loadAdUnit.bind(vpaid), 'already destroyed', 'must throw an error!');
        });


        it ('must not fire adunit load callback when destroyed', function (done) {
            var callback = sinon.spy();
            var vpaid = new VPAIDHTML5Client(el, video);
            var id = vpaid.getID();

            vpaid.loadAdUnit('', callback);
            vpaid.destroy();


            setTimeout(function () {
                assert(callback.callCount === 0, 'must not fire callback1 when destroyed!');
                done();
            }, 0);
        });
    });

    it('must implement isDestroyed', function () {
        var vpaid = new VPAIDHTML5Client(el, video);
        assert.isFunction(vpaid.isDestroyed, 'must be a function');
        assert(!vpaid.isDestroyed());
        vpaid.destroy();
        assert(vpaid.isDestroyed());
    });
});

