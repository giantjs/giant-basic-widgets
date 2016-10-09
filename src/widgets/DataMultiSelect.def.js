$oop.postpone($basicWidgets, 'DataMultiSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.MultiSelect,
        self = base.extend(cn)
            .addTrait($entity.EntityBound)
            .addTraitAndExtend($basicWidgets.DataSelect)
            .addTraitAndExtend($basicWidgets.EntityList);

    /**
     * @name $basicWidgets.DataMultiSelect.create
     * @function
     * @param {$entity.FieldKey} selectedKey
     * @param {$entity.FieldKey} [optionsKey]
     * @returns {$basicWidgets.DataMultiSelect}
     */

    /**
     * Expects the value to be stored in the same document.
     * @class
     * @extends $basicWidgets.MultiSelect
     * @extends $entity.EntityBound
     * @extends $basicWidgets.DataSelect
     * @extends $basicWidgets.EntityList
     */
    $basicWidgets.DataMultiSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.DataMultiSelect# */{
            /** @private */
            _syncSelectedToEntity: function () {
                var selectedKey = this.selectedKey,
                    selectedValuesBefore = this.selectedValues.toSet(),
                    selectedValuesAfter = selectedKey.toField().getItemsAsCollection().toSet(),
                    selectedValues = selectedValuesAfter.subtract(selectedValuesBefore).toCollection(),
                    deselectedValues = selectedValuesBefore.subtract(selectedValuesAfter).toCollection();

                // getOptionWidgetByValue is elevated by base class
                selectedValues
                    .mapValues(this.getOptionWidgetByValue)
                    .callOnEachItem('select');

                deselectedValues
                    .mapValues(this.getOptionWidgetByValue)
                    .callOnEachItem('deselect');
            }
        })
        .addMethods(/** @lends $basicWidgets.DataMultiSelect# */{
            /**
             * @param {$entity.FieldKey} selectedKey
             * @param {$entity.FieldKey} [optionsKey]
             * @ignore
             */
            init: function (selectedKey, optionsKey) {
                $assertion
                    .isFieldKey(selectedKey, "Invalid selected key")
                    .assert(
                        !selectedKey || selectedKey.toField().isA($entity.CollectionField),
                        "Invalid selected field type")
                    .isFieldKeyOptional(optionsKey, "Invalid options key");

                base.init.call(this);
                $entity.EntityBound.init.call(this);
                if (optionsKey) {
                    $basicWidgets.EntityList.init.call(this, optionsKey);
                }
                $basicWidgets.DataSelect.init.call(this, selectedKey);

                this.elevateMethod('onSelectionChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityList.afterAdd.call(this);
                }

                this._syncSelectedToEntity();

                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange)
                    .bindToDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityList.afterRemove.call(this);
                }

                this.unbindFromDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /**
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onItemsChange: function (event) {
                $basicWidgets.EntityList.onItemsChange.call(this, event);
                this._syncSelectedToEntity();
            },

            /**
             * @param {$basicWidgets.SelectSelectionChangeEvent} event
             * @ignore
             */
            onSelectionChange: function (event) {
                var selectedKey = this.selectedKey,
                    afterValues = event.afterValues.clone();

                if (selectedKey) {
                    selectedKey.toField()
                        .setValue(afterValues.items);
                }
            },

            /** @ignore */
            onSelectedFieldChange: function () {
                this._syncSelectedToEntity();
            }
        });
});
