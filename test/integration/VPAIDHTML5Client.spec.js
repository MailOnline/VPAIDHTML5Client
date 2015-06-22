'use strict';

var fs = require('fs');
var noop = require('../testHelper').noop;
var getBrowserifyPath = require('../testHelper').getBrowserifyPath;
var mockPostMessage = require('../testHelper').mockPostMessage;
var framePostMessage = require('../testHelper').framePostMessage;
var VPAIDHTML5Client = require('../../js/VPAIDHTML5Client');
var template = fs.readFileSync(__dirname + '/../fixtures/iframe.template.html', 'utf8');

describe('integration test', function () {

    describe('VPAIDHTML5Client <-> VPAIDHTML5iFrame', function()  {

        var el, video;
        var frameConfig = {
            template: template,
            extraOptions: {
                browserify_JS: getBrowserifyPath()
            }
        };

        beforeEach(function () {
            el = document.createElement('div');
            video = document.createElement('video');
            document.body.appendChild(el);
            document.body.appendChild(video);
        });

        afterEach(function () {
            document.body.removeChild(el);
            document.body.removeChild(video);
        });

        it('the iframe must handshake', function(done) {
            var onLoad = sinon.spy(function () {
                assert(onLoad.calledOnce);
                assert.isNull(onLoad.getCall(0).args[0])
                done();
            });
            var vpaid = new VPAIDHTML5Client(el, video, frameConfig);
            vpaid.loadAdUnit('/base/test/fixtures/simpleVPAIDAd.js', onLoad);
        });

        //TODO make test of handshake and initad and starting calling getters and setters

        describe('adUnit', function () {
            var vpaid;

            function createVPAID(onLoad) {
                var client = new VPAIDHTML5Client(el, video, frameConfig);
                client.loadAdUnit('/base/test/fixtures/simpleVPAIDAd.js', onLoad);
                return client;
            }

            function createAndHandshake(onHandShake) {
                var client = createVPAID(function(error, adUnit) {
                    adUnit.handshakeVersion('2.0', function(err) {
                        assert.isNull(err);
                        onHandShake(adUnit);
                    });
                });
                return client;
            }

            it('handshake must return version', function(done) {
                vpaid = createVPAID(function (error, adUnit) {
                    assert.isNull(error);
                    adUnit.handshakeVersion('2.0', function (err, version) {
                        assert.isNull(err);
                        assert.isString(version);
                        done();
                    });
                });
            });

            it('must be receive adLoaded after initAd is called', function(done) {
                vpaid = createAndHandshake(function(adUnit) {
                    adUnit.subscribe('AdLoaded', function(msg) {
                        assert.isNotNull(msg);
                        done();
                    });
                    adUnit.initAd(200, 200, 'normal', -1, {slot: el}, {videoSlot: video, videoSlotCanAutoPlay: true});
                });
            });
        })
    });

});

