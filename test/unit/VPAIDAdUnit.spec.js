var noop = require('../testHelper').noop;
var implementsProperties = require('../testHelper').implementsProperties;
var VPAIDAdUnit = require('../../js/VPAIDAdUnit');
var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');


describe('VPAIDAdUnit.js api', function () {

    it('is instance of IVPAIDAdUnit', function () {
        var invalidCreative = new VPAIDAdUnit({});
        assert.instanceOf(invalidCreative, IVPAIDAdUnit);
    });

    it('implement isValidVPAIDAd', function() {
        var invalidCreative = new VPAIDAdUnit({});
        assert.isFunction(invalidCreative.isValidVPAIDAd);
        assert(!invalidCreative.isValidVPAIDAd());

        var validCreative = new VPAIDAdUnit(new IVPAIDAdUnit());
        assert(validCreative.isValidVPAIDAd());
    });

    it('must implements all methods, getters & setters', function () {
        var invalidCreative = new VPAIDAdUnit({});
        assert(implementsProperties(invalidCreative, IVPAIDAdUnit.METHODS));
        assert(implementsProperties(invalidCreative, IVPAIDAdUnit.GETTERS));
        assert(implementsProperties(invalidCreative, IVPAIDAdUnit.SETTERS));
    });

    describe('method', function () {

        var clock;
        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            clock.restore();
        });

        it('handshakeVersion must pass all arguments to creative', function() {
            var creative = new IVPAIDAdUnit();

            var method = sinon.stub(creative, 'handshakeVersion');
            method.withArgs({}).throws('TypeError');

            var callback = sinon.spy();

            new VPAIDAdUnit(creative).handshakeVersion('2.0', noop);
            new VPAIDAdUnit(creative).handshakeVersion('2.0');
            new VPAIDAdUnit(creative).handshakeVersion({}, callback);
            clock.tick(1);

            assert(method.called, 'must call creative handshakeVersion');
            assert.deepEqual(method.getCall(0).args, ['2.0'], 'must call the first call with 2.0');
            assert.deepEqual(method.getCall(1).args, ['2.0'], 'must call the first call with 2.0');
            assert.isNotNull(callback.getCall(0).args[0], 'must send error to callback');

        });

        it('must pass all arguments to creative initAd', function() {
            var el = document.createElement('div');
            var video = document.createElement('video');

            var creative = new IVPAIDAdUnit();
            var method = sinon.stub(creative, 'initAd');
            var callback = sinon.spy();

            new VPAIDAdUnit(creative, el, video).initAd(200, 200, 'normal', -1, {}, {videoSlotCanAutoPlay: true}, callback);
            new VPAIDAdUnit(creative).initAd(200, 200, 'normal', -1, {}, {slot: el, videoSlot: video, videoSlotCanAutoPlay: true}, callback);
            clock.tick(1);

            assert(method.called, 'must call creative initAd');
            assert.deepEqual(method.getCall(0).args, [200, 200, 'normal', -1, {}, {slot: el, videoSlot: video, videoSlotCanAutoPlay: true}]);
            assert.deepEqual(method.getCall(1).args, [200, 200, 'normal', -1, {}, {slot: el, videoSlot: video, videoSlotCanAutoPlay: true}]);
        });

        it('must pass all arguments to creative subscribe', function() {
            var creative = new IVPAIDAdUnit();
            var validCreative = new VPAIDAdUnit(creative);
            var method = sinon.stub(creative, 'subscribe');
            validCreative.subscribe('someEvent', noop, this);
            clock.tick(1);

            assert(method.called, 'must call creative subscribe');
            assert.equal(validCreative.subscribe, validCreative.on, 'subscribe and on are the same');
            assert.deepEqual(method.getCall(0).args, [noop, 'someEvent', this], 'must change order of arguments to comply with the spec');
        });

        it('must pass all arguments to creative unsubscribe', function() {
            var creative = new IVPAIDAdUnit();
            var method = sinon.stub(creative, 'unsubscribe');
            var validCreative = new VPAIDAdUnit(creative);
            validCreative.unsubscribe('someEvent', noop);
            clock.tick(1);

            assert(method.called, 'must call creative unsubscribe');
            assert.equal(validCreative.subscribe, validCreative.on, 'unsubscribe and off are the same');
            assert.deepEqual(method.getCall(0).args, [noop, 'someEvent'], 'must change order of arguments to comply with the spec');
        });

        IVPAIDAdUnit.METHODS.forEach(function (methodKey) {
            var methodsToIgnore = [
                'subscribe',
                'unsubscribe',
                'initAd',
                'handshakeVersion'
            ];

            if (methodsToIgnore.indexOf(methodKey) !== -1) return;

            it(methodKey +' arguments must be empty', function() {
                var creative = new IVPAIDAdUnit();

                var method = sinon.stub(creative, methodKey);

                var vpaid = new VPAIDAdUnit(creative);
                vpaid[methodKey](noop);
                clock.tick(1);

                assert(method.called, 'must call creative method ' + methodKey);
                assert.deepEqual(method.getCall(0).args, [], 'must be empty');
            });

            it(methodKey +' must be handle when it throws', function() {
                var creative = new IVPAIDAdUnit();

                var method = sinon.stub(creative, methodKey);
                method.throws();
                var handler = sinon.spy();

                var vpaid = new VPAIDAdUnit(creative);
                vpaid.subscribe('AdError', handler);
                vpaid[methodKey]();
                clock.tick(100);

                assert(handler.called, 'must handle the error when no callback');
            });

        });

    });

    describe('getters', function () {

        var clock;
        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            clock.restore();
        });

        IVPAIDAdUnit.GETTERS.forEach(function (getterKey) {

            it(getterKey +' should return a value', function() {
                var creative = new IVPAIDAdUnit();

                var getter = sinon.stub(creative, getterKey);

                getter.onFirstCall().returns(-1)
                    .onSecondCall().throws('Some error');

                var callback1 = sinon.spy();
                var callback2 = sinon.spy();

                var vpaid = new VPAIDAdUnit(creative);
                vpaid[getterKey](callback1);
                vpaid[getterKey](callback2);
                clock.tick(1);

                assert(getter.called, 'must call creative getter ' + getterKey);
                assert(callback1.calledWith(null, -1));
                assert.typeOf(callback2.getCall(0).args[0], 'error', 'must return an error');
            });

        });

    });

    describe('setters', function () {

            var clock;
            beforeEach(function () {
                clock = sinon.useFakeTimers();
            });

            afterEach(function() {
                clock.restore();
            });

            IVPAIDAdUnit.SETTERS.forEach(function (setterKey) {

                it(setterKey +' should return a value', function() {
                    var creative = new IVPAIDAdUnit();

                    sinon.stub(creative, setterKey.replace('s', 'g'), function() {
                        return this._volume;
                    });

                    var setter = sinon.stub(creative, setterKey, function(value) {
                        if(sinon.match.number.test(value)) {
                            this._volume = value;
                        }else {
                            throw new Error('TypeError');
                        }
                    });

                    var callback1 = sinon.spy();
                    var callback2 = sinon.spy();

                    var vpaid = new VPAIDAdUnit(creative);
                    vpaid[setterKey](1, callback1);
                    vpaid[setterKey]({}, callback2);
                    clock.tick(1);

                    assert(setter.called, 'must call creative setter ' + setterKey);
                    assert(setter.getCall(0).calledWith(1), 'must send the value setted');
                    assert(callback1.calledWith(null, 1), 'must return value setted');
                    assert.typeOf(callback2.getCall(0).args[0], 'error', 'must return an error');
                });

        });

    })

});

