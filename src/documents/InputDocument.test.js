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
        equal(document.getField('name').getValue(), "foo", "should set name field");
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
        equal(document.getField('value').getValue(), "foo", "should set value field");
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
        equal(document.getField('state').getValue(), true, "should set state field");
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
        equal(document.getField('validator').getValue(), 'validator/foo',
            "should set state field");
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

    test("Validity getter", function () {
        var document = 'input/1'.toDocument()
            .unsetNode();

        equal(document.getValidity(), true, "should retrieve validity");
    });

    test("Input document change handler", function () {
        expect(3);

        'input/1'.toDocument().unsetNode();

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                console.log("event triggered");
                ok(true, "should change input validity");
                equal(event.payload.wasValid, undefined, "should set wasValid payload");
                deepEqual(event.payload.isValid, {}, "should set isValid payload");
            });

        'input/1'.toDocument()
            .setNode({
                name: 'foo',
                value: '1',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input value change handler", function () {
        expect(3);

        'input/1'.toDocument()
            .setNode({
                name: 'foo',
                value: '1',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                deepEqual(event.payload.wasValid, {}, "should set wasValid payload");
                deepEqual(event.payload.isValid, {
                    'validation-reason.not-a-number': true
                }, "should set isValid payload");
            });

        'input/1/foo'.toField().setValue('foo');
        'input/1/value'.toField().setValue('bar');

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input validator change handler", function () {
        expect(3);

        'input/1'.toDocument()
            .setNode({
                name: 'foo',
                value: 'abc'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                deepEqual(event.payload.wasValid, {}, "should set wasValid payload");
                deepEqual(event.payload.isValid, {
                    'validation-reason.not-a-number': true
                }, "should set isValid payload");
            });

        'input/1/foo'.toField().setValue('foo');
        'input/1/validator'.toField().setValue('numberValidator/1');

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input validator remove handler", function () {
        expect(3);

        'input/1'.toDocument()
            .setNode({
                name: 'foo',
                value: 'abc',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                deepEqual(event.payload.wasValid, {
                    'validation-reason.not-a-number': true
                }, "should set wasValid payload");
                deepEqual(event.payload.isValid, {}, "should set isValid payload");
            });

        'input/1/validator'.toField().unsetNode();

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });
}());
