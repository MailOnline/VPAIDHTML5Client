'use strict';
var noop = require('../testHelper').noop;
var Subscriber = require('../../js/subscriber');

describe('subscriber.js api', function () {
    it('must be a constructor function', function () {
        assert.isFunction(Subscriber);
    });

    describe('instance like object', function() {
        var subscriber;

        beforeEach(function () {
            subscriber = new Subscriber();
        });

        it('must return instance', function () {
            assert.instanceOf(subscriber, Subscriber);
        });

        describe('get', function () {
            it('must implement', function () {
                assert.isFunction(subscriber.get);
                assert.lengthOf(subscriber.get, 1);
            });

            it('must return an empty array if doesnt\'t exist any', function() {
                assert.isArray(subscriber.get('noEvent'));
                assert.lengthOf(subscriber.get('noEvent'), 0);
            });

        });

        describe('subscribe', function() {

            it('must implement', function() {
                assert.isFunction(subscriber.subscribe);
                assert.lengthOf(subscriber.subscribe, 3);
            });

            it('must register', function() {
                var f1 = function(){};
                var f2 = function(){};
                var f3 = function(){};
                subscriber.subscribe(f1, 'test', this);
                subscriber.subscribe(f2, 'test', this);
                subscriber.subscribe(f3, 'test1', this);

                assert.lengthOf(subscriber._subscribers.test, 2);
                assert.lengthOf(subscriber._subscribers.test1, 1);

                assert.sameDeepMembers(subscriber.get('test'), [{handler: f1, context: this}, {handler: f2, context: this}]);
                assert.sameDeepMembers(subscriber.get('test1'), [{handler: f3, context: this}]);
            });

        });

        describe('unsubscribe', function () {
            it('must implement', function() {
                assert.isFunction(subscriber.unsubscribe);
                assert.lengthOf(subscriber.unsubscribe, 2);
            });

            it('must not throw', function() {
                assert.doesNotThrow(function () {
                    subscriber.unsubscribe(noop, 'test');
                });
            });

            it('must unRegister', function() {
                subscriber.subscribe(function(){}, 'test', this);
                subscriber.subscribe(noop, 'test', this);
                subscriber.subscribe(function(){}, 'test1', this);
                subscriber.subscribe(noop, 'test1', this);

                assert.lengthOf(subscriber.get('test'), 2);
                assert.lengthOf(subscriber.get('test1'), 2);

                subscriber.unsubscribe(noop, 'test', this);
                subscriber.unsubscribe(noop, 'test1', this);

                assert.lengthOf(subscriber.get('test'), 1);
                assert.lengthOf(subscriber.get('test1'), 1);
            });

        });

        describe('unsubscribeAll', function () {

            it('must implement', function () {
                assert.isFunction(subscriber.unsubscribeAll);
            });

            it('must remove all', function (){
                subscriber.subscribe(function(){}, 'test', this);
                subscriber.subscribe(noop, 'test', this);
                subscriber.subscribe(function(){}, 'test1', this);
                subscriber.subscribe(noop, 'test1', this);

                assert.lengthOf(subscriber.get('test'), 2);
                assert.lengthOf(subscriber.get('test1'), 2);

                subscriber.unsubscribeAll();

                assert.lengthOf(subscriber.get('test'), 0);
                assert.lengthOf(subscriber.get('test1'), 0);
            });
        });

        describe('trigger', function () {
            var clock;

            beforeEach(function () {
                clock = sinon.useFakeTimers();
            });

            afterEach(function () {
                clock.restore();
            });

            it('must implement', function () {
                assert.isFunction(subscriber.trigger);
            });

            it('must trigger the event listeners', function (){
                var cb1 = [sinon.spy(), sinon.spy()];
                var cb2 = [sinon.spy()];

                cb1.forEach(function (cb) {
                    subscriber.subscribe(cb, 'event1');
                });

                cb2.forEach(function (cb) {
                    subscriber.subscribe(cb, 'event2');
                });

                var data1 = {};
                var data2 = {};
                subscriber.trigger('event1', data1);
                subscriber.trigger('event2', data2);

                clock.tick(100);

                cb1.forEach(function (cb) {
                    assert(cb.calledWith(data1));
                });

                cb2.forEach(function (cb) {
                    assert(cb.calledWith(data2));
                });
            });
        });

    });
});
