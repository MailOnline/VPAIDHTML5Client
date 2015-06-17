var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');

function LinearAd() {
}

IVPAIDAdUnit.METHODS.forEach(function (key) {
    LinearAd.prototype[key] = function () {
        console.log('method called:', key);
    }
});

window.getVPAIDAd = function() {
    return new LinearAd();
};

