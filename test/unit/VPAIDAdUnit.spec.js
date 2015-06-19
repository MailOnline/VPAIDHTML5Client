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
});

