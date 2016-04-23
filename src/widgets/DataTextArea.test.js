(function () {
    "use strict";

    module("DataTextArea");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataTextArea.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataTextArea.create('foo');
        }, "should raise exception on invalid arguments");

        var input = $basicWidgets.DataTextArea.create('input/1'.toDocumentKey());

        ok(input.entityKey.equals('input/1'.toDocumentKey()),
            "should set entityKey property");
    });

    test("Input state handler", function () {
        expect(1);

        var input = $basicWidgets.DataTextArea.create('input/1'.toDocumentKey());

        input.afterAdd();

        input.addMocks({
            _syncEntityToInputValue: function () {
                ok(true, "should sync entity to input value");
            }
        });

        input.setValue('bar');

        input.afterRemove();
    });
}());
