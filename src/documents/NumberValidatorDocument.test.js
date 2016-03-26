(function () {
    "use strict";

    module("NumberValidatorDocument");

    test("Document surrogate", function () {
        ok('numberValidator/1'.toDocument().isA($basicWidgets.NumberValidatorDocument),
            "should return NumberValidatorDocument instance");
    });

    test("Validation", function () {
        'numberValidator/1'.toDocument().setNode({
            minValue: 10,
            maxValue: 99999
        });

        equal('numberValidator/1'.toDocument().validate('abc'), false,
            "should return false for non-number");
        equal('numberValidator/1'.toDocument().validate(12345), true,
            "should return true for number");
        equal('numberValidator/1'.toDocument().validate("12345"), true,
            "should return true for stringified number");
        equal('numberValidator/1'.toDocument().validate(5), false,
            "should return false for lower than minimum");
        equal('numberValidator/1'.toDocument().validate(100000), false,
            "should return false for higher than maximum");
    });
}());
