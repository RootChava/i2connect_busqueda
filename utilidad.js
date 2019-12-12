const y = function (le) {
    return function (f) {
        return f(f);
    }(function (f) {
        return le(
            function (x, q) {
                return (f(f))(x, q);
            }
        );
    });
};

const ajustNum = (recAjust) => {
    return (tam, num) => {
        if (num.toString().length <= tam) return recAjust(tam, "0 " + num);
        else return num;
    };
};


module.exports = {
    ajustarNumero: y(ajustNum),
    twoDigits: (d) => {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    }
};