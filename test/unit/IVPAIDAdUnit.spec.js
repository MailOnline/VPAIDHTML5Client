var implementsProperties = require('../testHelper').implementsProperties;
var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');

describe('IVPAIDAdUnit.js api', function () {
    it('must implements all methods, getters & setters', function () {
        var vpaid = new IVPAIDAdUnit();
        assert(implementsProperties(vpaid, IVPAIDAdUnit.METHODS));
        assert(implementsProperties(vpaid, IVPAIDAdUnit.GETTERS));
        assert(implementsProperties(vpaid, IVPAIDAdUnit.SETTERS));
    });
});


