(function () {
    "use strict";

    module("InputDocument");

    test("Document surrogate", function () {
        ok('input/1'.toDocument().isA($basicWidgets.InputDocument),
            "should return InputDocument instance for 'input' document type");
    });

    test("Name setter", function () {
        var document = 'input/1'.toDocument().unsetNode();

        strictEqual(document.setInputName("foo"), document, "should be chainable");
        deepEqual(document.getNode(), {
            name: "foo"
        }, "should set name field");
    });

    test("Name getter", function () {
        var document = 'input/1'.toDocument()
            .unsetNode()
            .setInputName("foo");

        equal(document.getInputName(), "foo", "should retrieve name field");
    });

    test("Value setter", function () {
        var document = 'input/1'.toDocument().unsetNode();

        strictEqual(document.setInputValue("foo"), document, "should be chainable");
        deepEqual(document.getNode(), {
            value: "foo"
        }, "should set value field");
    });

    test("Value getter", function () {
        var document = 'input/1'.toDocument()
            .unsetNode()
            .setInputValue("foo");

        equal(document.getInputValue(), "foo", "should retrieve value field");
    });

    test("State setter", function () {
        var document = 'input/1'.toDocument().unsetNode();

        strictEqual(document.setInputState(true), document, "should be chainable");
        deepEqual(document.getNode(), {
            state: true
        }, "should set state field");
    });

    test("State getter", function () {
        var document = 'input/1'.toDocument()
            .unsetNode()
            .setInputState(true);

        equal(document.getInputState(), true, "should retrieve state field");
    });

    test("Validator setter", function () {
        var document = 'input/1'.toDocument().unsetNode();

        strictEqual(document.setValidatorKey('validator/foo'.toDocumentKey()), document,
            "should be chainable");
        deepEqual(document.getNode(), {
            validator: 'validator/foo'
        }, "should set state field");
    });

    test("Validator getter", function () {
        var document = 'input/1'.toDocument()
            .unsetNode()
            .setValidatorKey('validator/foo'.toDocumentKey()),
            validatorKey;

        validatorKey = document.getValidatorKey();
        ok(validatorKey.isA($entity.DocumentKey), "should return DocumentKey instance");
        ok(validatorKey.equals('validator/foo'.toDocumentKey()),
            "should retrieve validator key");
    });
}());
