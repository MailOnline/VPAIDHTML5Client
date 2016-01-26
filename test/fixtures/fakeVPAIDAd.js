//a fake vpaid ad only to pass the validation of IVPAIDAdUnit
var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');

window.getVPAIDAd = function() {
    return new IVPAIDAdUnit();
};

