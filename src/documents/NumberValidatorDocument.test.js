(function () {
    "use strict";

    module("NumberValidatorDocument");

    test("Document surrogate", function () {
        ok('validator/number'.toDocument().isA($basicWidgets.NumberValidatorDocument),
            "should return NumberValidatorDocument instance");
    });

    test("Validation", function () {
        equal('validator/number'.toDocument().validate('abc'), false,
            "should return false for non-number");
        equal('validator/number'.toDocument().validate(12345), true,
            "should return true for number");
        equal('validator/number'.toDocument().validate("12345"), true,
            "should return true for stringified number");
    });
}());
