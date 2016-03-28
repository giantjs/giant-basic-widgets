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
        ], "should fail for non-number");
        deepEqual('numberValidator/1'.toDocument().validate(12345), [],
            "should pass for number within min and max");
        deepEqual('numberValidator/1'.toDocument().validate("12345"), [],
            "should pass for stringified number");
        deepEqual('numberValidator/1'.toDocument().validate(5), [
            $basicWidgets.NumberValidatorDocument.REASON_VALUE_TOO_LOW
        ], "should fail for number lower than minimum");
        deepEqual('numberValidator/1'.toDocument().validate(100000), [
            $basicWidgets.NumberValidatorDocument.REASON_VALUE_TOO_HIGH
        ], "should fail for number higher than maximum");

        'numberValidator/1'.toDocument().unsetNode();

        deepEqual('numberValidator/1'.toDocument().validate(5), [],
            "should pass with no minimum");
        deepEqual('numberValidator/1'.toDocument().validate(100000), [],
            "should pass with no maximum");

    });
}());
