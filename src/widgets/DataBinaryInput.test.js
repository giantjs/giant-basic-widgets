(function () {
    "use strict";

    module("DataBinaryInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataBinaryInput.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataBinaryInput.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var checkbox = $basicWidgets.DataBinaryInput.create('checkbox', 'input/1'.toDocumentKey());

        ok(checkbox.entityKey.equals('input/1'.toDocumentKey()),
            "should set entityKey property");
    });

    test("Input state handler", function () {
        expect(1);

        var checkbox = $basicWidgets.DataBinaryInput.create('checkbox', 'input/1'.toDocumentKey());

        'input/1'.toDocument().setNode({
            baseValue: 'foo'
        });

        checkbox.afterAdd();

        checkbox.addMocks({
            _syncEntityToInputState: function () {
                ok(true, "should sync state in entity to input");
            }
        });

        checkbox.select();

        checkbox.afterRemove();
    });

    test("State change handler", function () {
        expect(1);

        var checkbox = $basicWidgets.DataBinaryInput.create('checkbox', 'input/1'.toDocumentKey());

        'input/1'.toDocument().unsetNode();

        checkbox.afterAdd();

        checkbox.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync state in entity to input");
            }
        });

        'input/1'.toDocument()
            .setNode({
                value: true
            });

        checkbox.afterRemove();
    });
}());
