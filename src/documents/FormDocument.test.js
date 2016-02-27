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
}());
