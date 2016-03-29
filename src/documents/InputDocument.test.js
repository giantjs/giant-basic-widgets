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
        expect(6);

        'input/1'.toDocument().unsetNode();

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                equal(event.wasValid, undefined, "should set wasValid payload");
                equal(event.isValid, true, "should set isValid payload");
            })
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDATION_FAILURE_CHANGE, function (event) {
                ok(true, "should change input validation failure");
                equal(event.reasonsBefore, undefined, "should set reasonsBefore payload");
                deepEqual(event.reasonsAfter, {}, "should set reasonsAfter payload");
            });

        'input/1'.toDocument()
            .setNode({
                name     : 'foo',
                value    : '1',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input value change handler", function () {
        expect(6);

        'input/1'.toDocument()
            .setNode({
                name     : 'foo',
                value    : '1',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                equal(event.wasValid, true, "should set wasValid payload");
                equal(event.isValid, false, "should set isValid payload");
            })
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDATION_FAILURE_CHANGE, function (event) {
                ok(true, "should change input validation failure");
                deepEqual(event.reasonsBefore, {}, "should set reasonsBefore payload");
                deepEqual(event.reasonsAfter, {
                    'validation-reason.not-a-number': true
                }, "should set reasonsAfter payload");
            });

        'input/1/foo'.toField().setValue('foo');
        'input/1/value'.toField().setValue('bar');

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input value change between invalid states handler", function () {
        expect(3);

        'numberValidator/1'.toDocument()
            .setNode({
                minValue: 6,
                maxValue: 4
            });

        'input/1'.toDocument()
            .setNode({
                name     : 'foo',
                value    : 5,
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(false, "should NOT change input validity");
            })
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDATION_FAILURE_CHANGE, function (event) {
                ok(true, "should change input validation failure");
                deepEqual(event.reasonsBefore, {
                    "validation-reason.value-too-high": true,
                    "validation-reason.value-too-low": true
                }, "should set reasonsBefore payload");
                deepEqual(event.reasonsAfter, {
                    "validation-reason.value-too-high": true
                }, "should set reasonsAfter payload");
            });

        // will still be invalid after change - but for different reasons
        'input/1/value'.toField().setValue(7);

        'input/1'.toDocumentKey()
            .unsubscribeFrom();

        'numberValidator/1'.toDocument().unsetNode();
    });

    test("Input validator change handler", function () {
        expect(6);

        'input/1'.toDocument()
            .setNode({
                name : 'foo',
                value: 'abc'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                equal(event.wasValid, true, "should set wasValid payload");
                equal(event.isValid, false, "should set isValid payload");
            })
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDATION_FAILURE_CHANGE, function (event) {
                ok(true, "should change input validation failure");
                deepEqual(event.reasonsBefore, {}, "should set reasonsBefore payload");
                deepEqual(event.reasonsAfter, {
                    'validation-reason.not-a-number': true
                }, "should set reasonsAfter payload");
            });

        'input/1/foo'.toField().setValue('foo');
        'input/1/validator'.toField().setValue('numberValidator/1');

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });

    test("Input validator remove handler", function () {
        expect(6);

        'input/1'.toDocument()
            .setNode({
                name     : 'foo',
                value    : 'abc',
                validator: 'numberValidator/1'
            });

        'input/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, function (event) {
                ok(true, "should change input validity");
                equal(event.wasValid, false, "should set wasValid payload");
                equal(event.isValid, true, "should set isValid payload");
            })
            .subscribeTo($basicWidgets.EVENT_INPUT_VALIDATION_FAILURE_CHANGE, function (event) {
                ok(true, "should change input validation failure");
                deepEqual(event.reasonsBefore, {
                    'validation-reason.not-a-number': true
                }, "should set reasonsBefore payload");
                deepEqual(event.reasonsAfter, {}, "should set reasonsAfter payload");
            });

        'input/1/validator'.toField().unsetNode();

        'input/1'.toDocumentKey()
            .unsubscribeFrom();
    });
}());
