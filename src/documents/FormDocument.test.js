(function () {
    "use strict";

    module("FormDocument");

    test("Document surrogate", function () {
        ok('form/1'.toDocument().isA($basicWidgets.FormDocument),
            "should return FormDocument instance for 'input' document type");
    });

    test("Adding input", function () {
        var document = 'form/1'.toDocument();

        // clearing document contents
        document.unsetNode();

        document.addInput('input/1'.toDocumentKey());

        deepEqual('form/1'.toDocument().getNode(), {
            inputs: {
                'input/1': 'input/1'
            }
        }, "should set item in values collection");
    });

    test("Removing input", function () {
        var document = 'form/1'.toDocument();

        // initializing document contents
        document.setNode({
            inputs: {
                'input/1': 'input/1'
            }
        });

        document.removeInput('input/1'.toDocumentKey());

        deepEqual('form/1'.toDocument().getNode(), {
            inputs: {}
        }, "should remove item from values collection");
    });

    test("Value extraction", function () {
        'input/1'.toDocument()
            .setNode({
                name : 'foo',
                value: 1
            });
        'input/2'.toDocument()
            .setNode({
                name : 'foo',
                value: 2
            });
        'input/3'.toDocument()
            .setNode({
                name : 'bar',
                value: "Hello World"
            });

        'form/1'.toDocument()
            .unsetNode()
            .addInput('input/1'.toDocumentKey())
            .addInput('input/2'.toDocumentKey())
            .addInput('input/3'.toDocumentKey());

        var inputValues = 'form/1'.toDocument().getQueryParams();

        ok(inputValues.isA($data.Dictionary), "should return Dictionary instance");

        deepEqual(inputValues.items, {
            foo: [1, 2],
            bar: "Hello World"
        }, "should return name-value associations");
    });

    test("Form validation", function () {
        'input/1'.toDocument()
            .setNode({
                name     : 'foo',
                value: 1,
                validator: 'validator/number'
            });
        'input/2'.toDocument()
            .setNode({
                name : 'foo',
                value: 2
            });
        'input/3'.toDocument()
            .setNode({
                name : 'bar',
                value: "Hello World"
            });

        'form/1'.toDocument()
            .unsetNode()
            .addInput('input/1'.toDocumentKey())
            .addInput('input/2'.toDocumentKey())
            .addInput('input/3'.toDocumentKey());

        equal('form/1'.toDocument().isValid(), true,
            "should return true for all valid inputs");

        'input/1/value'.toField().setValue("abc");

        equal('form/1'.toDocument().isValid(), false,
            "should return false for at least 1 invalid input");
    });

    test("Input validity change handler", function () {
        expect(3);

        'input/1'.toDocument().setNode({
            name     : 'foo',
            value    : '12345',
            validator: 'validator/number'
        });

        'input/2'.toDocument().setNode({
            name : 'foo',
            value: 'hello'
        });

        'form/1'.toDocument().setNode({
            inputs: {
                'input/1': 'input/1',
                'input/2': 'input/2'
            }
        });

        function onFormValidityChange(event) {
            ok(event.sender.equals('form/1'.toDocumentKey()),
                "should trigger form validity change event");
            equal(event.payload.wasValid, true, "should set wasValid property");
            equal(event.payload.isValid, false, "should set isValid property");
        }

        'form/1'.toDocumentKey()
            .subscribeTo($basicWidgets.EVENT_FORM_VALIDITY_CHANGE, onFormValidityChange);

        'input/1/value'.toField().setValue('baz');

        'form/1'.toDocumentKey()
            .unsubscribeFrom($basicWidgets.EVENT_FORM_VALIDITY_CHANGE, onFormValidityChange);

        'form/1'.toDocument().unsetNode();
        'form/2'.toDocument().unsetNode();
        'input/1'.toDocument().unsetNode();
    });
}());
