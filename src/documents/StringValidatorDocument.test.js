(function () {
    "use strict";

    module("StringValidatorDocument");

    test("Document surrogate", function () {
        ok('stringValidator/1'.toDocument().isA($basicWidgets.StringValidatorDocument),
            "should return StringValidatorDocument instance");
    });

    test("Validation", function () {
        'stringValidator/1'.toDocument().setNode({
            minLength: 2,
            maxLength: 6
        });

        deepEqual('stringValidator/1'.toDocument().validate("12345"), [],
            "should pass for string of valid ength");
        deepEqual('stringValidator/1'.toDocument().validate("1"), [
            $basicWidgets.StringValidatorDocument.REASON_TOO_SHORT
        ], "should fail for string too short");
        deepEqual('stringValidator/1'.toDocument().validate("1234567"), [
            $basicWidgets.StringValidatorDocument.REASON_TOO_LONG
        ], "should fail for string too long");

        'stringValidator/1'.toDocument().unsetNode();

        deepEqual('stringValidator/1'.toDocument().validate("1"), [],
            "should pass with no minimum");
        deepEqual('stringValidator/1'.toDocument().validate("1234567"), [],
            "should pass with no maximum");
    });
}());
