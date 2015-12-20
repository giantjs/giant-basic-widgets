(function () {
    "use strict";

    module("LocaleText");

    test("Instantiation", function () {
        var localeText = $basicWidgets.LocaleText.create();

        ok(localeText.hasOwnProperty('originalContentString'),
            "should add originalContentString property");
    });

    test("Original content string setter", function () {
        var localeText = $basicWidgets.LocaleText.create(),
            originalContentString = "Hello".toTranslatable();

        strictEqual(localeText.setOriginalContentString(originalContentString), localeText,
            "should be chainable");
        strictEqual(localeText.originalContentString, originalContentString,
            "should set originalContentString property");
    });
}());
