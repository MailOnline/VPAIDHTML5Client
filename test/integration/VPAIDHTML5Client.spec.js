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

        it('the iframe must call the handshake', function(done) {
            var onLoad = sinon.spy(function () {
                assert(onLoad.calledOnce);
                assert.isNull(onLoad.getCall(0).args[0])
                done();
            });
            var vpaid = new VPAIDHTML5Client(el, video, frameConfig);
            vpaid.loadAdUnit('/base/test/fixtures/simpleVPAIDAd.js', onLoad);
        });

    });

});

