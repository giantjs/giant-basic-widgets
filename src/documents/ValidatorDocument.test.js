(function () {
    "use strict";

    module("ValidatorDocument");

    test("Document surrogate", function () {
        ok('validator/foo'.toDocument().isA($basicWidgets.ValidatorDocument),
            "should return ValidatorDocument instance for 'validator' document type");
    });

    test("Validation", function () {
        equal('validator/foo'.toDocument().validate(12345), true, "should return true");
    });
}());
