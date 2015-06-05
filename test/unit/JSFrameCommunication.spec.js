'use strict';

var JSFrameCommunication = require('../../js/JSFrameCommunication');

describe('JSFrameCommunication.js api', function()  {
    it('must exist', function () {
        assert.isFunction(JSFrameCommunication, 'must be a function');
    });

    it('must implement postMessage', function () {
        var fakePost = sinon.stub(window, 'postMessage');
        var frameComm = new JSFrameCommunication(window, '*', ['*']);
        var expected0Arg = {type: 'event', typeDetail: 'AdLoaded', msg: [null, 'ok']};

        assert.isFunction(frameComm.postMessage);
        frameComm.postMessage('event', 'AdLoaded', [null, 'ok']);

        assert(fakePost.calledOnce);
        assert(fakePost.calledWith(JSON.stringify(expected0Arg), '*'));
        assert.deepEqual(JSON.parse(fakePost.getCall(0).args[0]), expected0Arg);
    });
});


