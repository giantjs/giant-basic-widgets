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

    test("Selection change handler", function (assert) {
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

        var done = assert.async(),
            select = $basicWidgets.DataMultiSelect.create(
                'multi-select/1/options'.toFieldKey(),
                'multi-select/1/selected'.toFieldKey())
                .addToParent($basicWidgets.Application.create()),
            items = {};

        $entity.Field.addMocks({
            setValue: function (value) {
                if (this.entityKey.equals('multi-select/1/selected'.toFieldKey())) {
                    // TODO: Check that value is copy.
                    deepEqual(value, items, "should set items in selected collection field");
                    notStrictEqual(value, items, "should set cloned collection items");
                }

                $entity.Field.removeMocks();
                select.removeFromParent();
                done();
            }
        });

        select.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
            .setPayloadItems({
                afterValues: items
            })
            .triggerSync();
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
