(function () {
    "use strict";

    module("ValidatorDocument");

    test("Document surrogate", function () {
        ok('validator/foo'.toDocument().isA($basicWidgets.ValidatorDocument),
            "should return ValidatorDocument instance for 'validator' document type");
    });

    test("Validation", function () {
        var reasons = 'validator/foo'.toDocument().validate(12345);

        ok(reasons instanceof Array, "should return array");
        equal(reasons.length, 0, "should return zero length array to signal validity");
    });
}());
