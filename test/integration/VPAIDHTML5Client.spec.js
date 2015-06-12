'use strict';

var fs = require('fs');
var noop = require('../testHelper').noop;
var getBrowserifyPath = require('../testHelper').getBrowserifyPath;
var mockPostMessage = require('../testHelper').mockPostMessage;
var framePostMessage = require('../testHelper').framePostMessage;
var VPAIDHTML5Client = require('../../js/VPAIDHTML5Client');
var template = fs.readFileSync(__dirname + '/../iframe.template.html', 'utf8');

describe('integration test', function () {

    describe('VPAIDHTML5Client <-> VPAIDHTML5iFrame', function()  {

        var el;
        var url = '/base/js/';
        var frameConfig = {
            origin: '*',
            allowed: ['*'],
            template: template,
            templateConfig: {
                browserify_JS: getBrowserifyPath()
            }
        };

        beforeEach(function () {
            el = document.createElement('div');
            document.body.appendChild(el);
        });

        afterEach(function () {
            document.body.removeChild(el);
        });

        it('the iframe must call the handshake', function(done) {
            var onLoad = sinon.spy(function () {
                assert(onLoad.calledOnce);
                assert.sameDeepMembers(onLoad.getCall(0).args, [null, 'success']);
                done();
            });
            var vpaid = new VPAIDHTML5Client(el, url, frameConfig, onLoad);
        });

    });

});

