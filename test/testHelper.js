module.exports.after = function after(count, handler) {
    return function () {
        count--;
        if (count <= 0) {
            handler();
        }
    };
}

module.exports.noop = function (){};

