'use strict';

var noop = require('../testHelper').noop;
var unique = require('../../js/utils').unique('hello');
var after = require('../testHelper').after;
var framePostMessage = require('../testHelper').framePostMessage;
var JSFrameCommunication = require('../../js/JSFrameCommunication');

describe('JSFrameCommunication.js api', function()  {
    it('must exist', function () {
        assert.isFunction(JSFrameCommunication, 'must be a function');
    });

    it('must implement getID', function () {
        var id = unique();
        var frameComm = new JSFrameCommunication(window, '*', ['*'], id);
        assert.isFunction(frameComm.getID);
        assert.equal(frameComm.getID(), id);
    });

    it('must implement postMessage', function () {
        var fakePost = sinon.stub(window, 'postMessage');
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        var expected0Arg = {id: frameComm.getID(), type: 'event', typeDetail: 'AdLoaded', msg: [null, 'ok']};

        assert.isFunction(frameComm.postMessage);
        frameComm.postMessage('event', 'AdLoaded', [null, 'ok']);

        assert(fakePost.calledOnce);
        assert(fakePost.calledWith(JSON.stringify(expected0Arg), '*'));
        assert.deepEqual(JSON.parse(fakePost.getCall(0).args[0]), expected0Arg);
    });

    it('must implement on', function () {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        assert.isFunction(frameComm.on);

        assert.equal(frameComm._subscribers.size(), 0);

        frameComm.on('hello', noop);
        assert.equal(frameComm._subscribers.size(), 1);

        frameComm.on('hello1', noop);
        assert.equal(frameComm._subscribers.size(), 2);
    });

    it('must implement off', function () {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        assert.isFunction(frameComm.off);
    });

    it('must implement offEvent', function () {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        assert.isFunction(frameComm.offEvent);
    });

    it('must implement offAll', function () {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        assert.isFunction(frameComm.offAll);
    });

    it('must implement _trigger', function (done) {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        assert.isFunction(frameComm._trigger);
        var callback1, callback2;

        var arg1 = [null, {msg: 'lost message :('}];
        var arg2 = [null, {msg: 'some message'}];
        var arg3 = [{msg: 'some error'}, null];
        var arg4 = [null, {msg: 'some other message'}];

        var counter = after(3, function () {
            assert(callback1.calledTwice);
            assert(callback2.calledOnce);

            assert.deepEqual(callback1.getCall(0).args, arg2);
            assert.deepEqual(callback1.getCall(1).args, arg3);
            assert.deepEqual(callback2.getCall(0).args, arg4);
            done();
        });
        callback1 = sinon.spy(counter);
        callback2 = sinon.spy(counter);

        frameComm.on('hello1',  callback1);
        frameComm.on('hello2',  callback2);

        frameComm._trigger.apply(frameComm, ['no subscribers'].concat(arg1));
        frameComm._trigger.apply(frameComm, ['hello1'].concat(arg2));
        frameComm._trigger.apply(frameComm, ['hello1'].concat(arg3));
        frameComm._trigger.apply(frameComm, ['hello2'].concat(arg4));
    });

    it('must handle window message events', function() {
        var frameComm = new JSFrameCommunication(window, '*', ['*'], unique());
        var data = {id: frameComm.getID(), type: 'event', typeDetail: 'hello1', msg: [null, 'success']};

        var callback1 = sinon.spy(function () {
            assert(callback1.calledOnce);
            assert.sameDeepMembers(callback1.getCall(0).args, [null, 'success']);
        });

        frameComm.on('hello1', callback1);

        framePostMessage(data);
    });

});

