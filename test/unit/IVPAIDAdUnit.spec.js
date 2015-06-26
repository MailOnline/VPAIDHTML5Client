var implementsProperties = require('../testHelper').implementsProperties;
var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');
var noop = require('../testHelper').noop;

describe('IVPAIDAdUnit.js api', function () {
    it('must implements all methods, getters & setters', function () {
        var vpaid = new IVPAIDAdUnit();
        assert(implementsProperties(vpaid, IVPAIDAdUnit.METHODS));
        assert(implementsProperties(vpaid, IVPAIDAdUnit.GETTERS));
        assert(implementsProperties(vpaid, IVPAIDAdUnit.SETTERS));
    });

    describe('checkVPAIDInterface', function() {

        it('must be valid VPAID 1.0', function () {
            var obj = {};
            var ignore = ['skipAd'];
            IVPAIDAdUnit.METHODS.forEach(function (method) {
                if (ignore.indexOf(method) !== -1) return;
                obj[method] = noop;
            });

            assert(IVPAIDAdUnit.checkVPAIDInterface(obj));
        });

        it('must be valid VPAID 2.0', function () {
            var obj = {};
            IVPAIDAdUnit.METHODS.forEach(function (method) {
                obj[method] = noop;
            });

            assert(IVPAIDAdUnit.checkVPAIDInterface(obj));
        });

        it('must be invalid VPAID', function () {
            var obj = {};

            assert(!IVPAIDAdUnit.checkVPAIDInterface(obj));
        });
    });
});


