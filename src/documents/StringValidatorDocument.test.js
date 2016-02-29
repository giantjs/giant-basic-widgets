(function () {
    "use strict";

    module("StringValidatorDocument");

    test("Document surrogate", function () {
        ok('validator/string'.toDocument().isA($basicWidgets.StringValidatorDocument),
            "should return StringValidatorDocument instance");
    });

    test("Validation", function () {
        equal('validator/string'.toDocument().validate(12345), false,
            "should return false for non-string");
        equal('validator/string'.toDocument().validate("12345"), true,
            "should return true for string");
    });
}());
