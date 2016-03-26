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

        deepEqual('numberValidator/1'.toDocument().validate('abc'), [
            $basicWidgets.NumberValidatorDocument.REASON_NAN
        ], "should return NAN reason for non-number");
        deepEqual('numberValidator/1'.toDocument().validate(12345), [],
            "should return empty array for number");
        deepEqual('numberValidator/1'.toDocument().validate("12345"), [],
            "should return empty array for stringified number");
        deepEqual('numberValidator/1'.toDocument().validate(5), [
            $basicWidgets.NumberValidatorDocument.REASON_VALUE_TOO_LOW
        ], "should return false for lower than minimum");
        deepEqual('numberValidator/1'.toDocument().validate(100000), [
            $basicWidgets.NumberValidatorDocument.REASON_VALUE_TOO_HIGH
        ], "should return false for higher than maximum");
    });
}());
