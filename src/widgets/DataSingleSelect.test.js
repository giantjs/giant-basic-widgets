(function () {
    "use strict";

    module("DataSingleSelect");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataSingleSelect.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $basicWidgets.DataSingleSelect.create('foo/bar'.toDocumentKey());
        }, "should raise exception on invalid argument");
    });

    test("Selected field change handler", function () {
        expect(1);

        $entity.config.appendNode('document>field'.toPath(), {
            'single-select/options': {
                fieldType: 'collection'
            },
            'single-select/selected': {
                fieldType: 'string'
            }
        });

        var select = $basicWidgets.DataSingleSelect.create(
            'single-select/1/options'.toFieldKey(),
            'single-select/1/selected'.toFieldKey())
            .addToParent($basicWidgets.Application.create());

        select.addMocks({
            _syncSelectedToEntity: function () {
                ok(true, "should sync selected state to entity");
            }
        });

        'single-select/1/selected'.toField().setValue(1);

        select.removeFromParent();
    });
}());
