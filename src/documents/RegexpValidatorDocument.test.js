(function () {
    "use strict";

    module("RegexpValidatorDocument");

    test("Document surrogate", function () {
        ok('regexpValidator/1'.toDocument().isA($basicWidgets.RegexpValidatorDocument),
            "should return RegexpValidatorDocument instance");
    });

    test("Validation", function () {
        'regexpValidator/1'.toDocument().setNode({
            regexp: 'hello'
        });

        deepEqual('regexpValidator/1'.toDocument().validate("hello world"), [],
            "should pass for string that matches regexp");
        deepEqual('regexpValidator/1'.toDocument().validate("1"), [
            $basicWidgets.RegexpValidatorDocument.REASON_REGEXP_MISMATCH
        ], "should fail for non-matching string");

        'regexpValidator/1'.toDocument().unsetNode();

        deepEqual('regexpValidator/1'.toDocument().validate("1"), [],
            "should pass with no regexp");
    });
}());
