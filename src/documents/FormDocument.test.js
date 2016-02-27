(function () {
    "use strict";

    module("FormDocument");

    test("Document surrogate", function () {
        ok('form/1'.toDocument().isA($basicWidgets.FormDocument),
            "should return FormDocument instance for 'input' document type");
    });

    test("Input value setter", function () {
        var document = 'form/1'.toDocument();

        // clearing document contents
        document.unsetNode();

        document.setInputValue('input/1'.toDocumentKey(), "Hello World!");

        deepEqual('form/1'.toDocument().getNode(), {
            values: {
                'input/1': "Hello World!"
            }
        }, "should set item in values collection");
    });

    test("Clearing input value", function () {
        var document = 'form/1'.toDocument();

        // initializing document contents
        document.setNode({
            values: {
                'input/1': "Hello World!"
            }
        });

        document.clearInputValue('input/1'.toDocumentKey());

        deepEqual('form/1'.toDocument().getNode(), {
            values: {}
        }, "should remove item from values collection");
    });

    test("Input value getter", function () {
        var document = 'form/1'.toDocument();

        // initializing document contents
        document.setNode({
            values: {
                'input/1': "Hello World!"
            }
        });

        equal(document.getInputValue('input/1'.toDocumentKey()), "Hello World!");
    });
}());
