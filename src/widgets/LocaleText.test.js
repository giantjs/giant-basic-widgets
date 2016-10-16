(function () {
    "use strict";

    module("LocaleText");

    test("Instantiation", function () {
        var localeText = $basicWidgets.LocaleText.create();

        ok(localeText.hasOwnProperty('originalContentString'),
            "should add originalContentString property");
    });

    test("Original content string setter", function () {
        expect(3);

        var localeText = $basicWidgets.LocaleText.create(),
            originalContentString = "Hello".toTranslatable();

        localeText.addMocks({
           _updateContentString: function () {
               ok(true, "should update content string");
           }
        });

        strictEqual(localeText.setOriginalContentString(originalContentString), localeText,
            "should be chainable");
        strictEqual(localeText.originalContentString, originalContentString,
            "should set originalContentString property");
    });
}());
