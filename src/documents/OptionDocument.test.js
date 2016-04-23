(function () {
    "use strict";

    module("OptionDocument");

    test("Document surrogate", function () {
        ok('option/1'.toDocument().isA($basicWidgets.OptionDocument),
            "should return OptionDocument instance for 'option' document type");
    });

    test("Value setter", function () {
        var document = 'option/1'.toDocument().unsetNode();

        strictEqual(document.setValue("foo"), document, "should be chainable");
        equal(document.getField('value').getValue(), "foo", "should set value field");
    });

    test("Value getter", function () {
        var document = 'option/1'.toDocument()
            .unsetNode()
            .setValue("foo");

        equal(document.getValue(), "foo", "should retrieve value field");
    });

    test("Description setter", function () {
        var document = 'option/1'.toDocument().unsetNode();

        strictEqual(document.setDescription("foo"), document, "should be chainable");
        equal(document.getField('description').getValue(), "foo", "should set description field");
    });

    test("Description getter", function () {
        var document = 'option/1'.toDocument()
            .unsetNode()
            .setDescription("foo");

        equal(document.getDescription(), "foo", "should retrieve description field");
    });
}());
