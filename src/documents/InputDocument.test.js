(function () {
    "use strict";

    module("InputDocument");

    test("Document surrogate", function () {
        ok('input/1'.toDocument().isA($basicWidgets.InputDocument),
            "should return InputDocument instance for 'input' document type");
    });
}());
