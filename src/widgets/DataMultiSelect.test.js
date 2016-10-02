(function () {
    "use strict";

    module("DataMultiSelect");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataMultiSelect.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $basicWidgets.DataMultiSelect.create('foo/bar'.toDocumentKey());
        }, "should raise exception on invalid argument");
    });

    test("Selected field change handler", function () {
        expect(2);

        $entity.config.appendNode('document>field'.toPath(), {
            'multi-select/options': {
                fieldType: 'collection'
            },
            'multi-select/single-selected': {
                fieldType: 'string'
            },
            'multi-select/selected': {
                fieldType: 'collection'
            }
        });

        throws(function () {
            $basicWidgets.DataMultiSelect.create(
                'multi-select/1/options'.toFieldKey(),
                'multi-select/1/single-selected'.toFieldKey());
        }, "should throw exception on invalid argument");

        var select = $basicWidgets.DataMultiSelect.create(
            'multi-select/1/options'.toFieldKey(),
            'multi-select/1/selected'.toFieldKey())
            .addToParent($basicWidgets.Application.create());

        select.addMocks({
            _syncSelectedToEntity: function () {
                ok(true, "should sync selected state to entity");
            }
        });

        'multi-select/1/selected'.toField().setValue(1);

        select.removeFromParent();
    });
}());
